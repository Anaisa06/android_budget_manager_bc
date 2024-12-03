import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Budget } from './entities/budget.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { addWeeks, endOfDay, endOfMonth, endOfWeek, getMonth, isAfter, isWithinInterval, setDate, startOfDay, startOfMonth, startOfWeek, subHours } from 'date-fns';
import { CategoriesService } from 'src/categories/categories.service';
import { BudgetFrecuency, BugdetType } from 'src/common/enums/budget.enum';
import { Category } from 'src/categories/entities/category.entity';
import { TransactionsQueryDto } from './dto/transactions-query.dto';

@Injectable()
export class BudgetsService {
  constructor(
    @InjectRepository(Budget) private budgetRepository: Repository<Budget>,
    private categoriesService: CategoriesService
  ) {}

  async create (createBudgetDto: CreateBudgetDto, user: User) {
    const category = await this.categoriesService.findOne(createBudgetDto.categoryId);
    const {startDate, endDate, total, frequency} = createBudgetDto;

    if (createBudgetDto.type === BugdetType.OCASSIONAL) return await this.createOcassionalBudget(startDate, endDate, user, category, total);

    return await this.createFrequentBudget(frequency, user, category, total);

  }

  async createOcassionalBudget(startDate: Date, endDate: Date, user: User, category: Category, total: number) {
    if(!startDate || !endDate) throw new BadRequestException('start and end date are required');

   if( !isAfter(endDate, startDate)) throw new BadRequestException('end date must be after start date')

    const newBudget = this.budgetRepository.create({startDate, endDate, category, total, user, type: BugdetType.OCASSIONAL});

    return await this.budgetRepository.save(newBudget);
  }

  async createFrequentBudget(frequency: BudgetFrecuency, user: User, category: Category, total: number) {
    if(!frequency) throw new BadRequestException('Frecuency is required');

    const currentDate = new Date();
    let startDate: Date;
    let endDate: Date;

    if (frequency === BudgetFrecuency.MONTHLY) {
      endDate = endOfMonth(currentDate);
      startDate = startOfMonth(currentDate);
    }

    if (frequency === BudgetFrecuency.BIWEEKLY) {

      const dayOfMonth = currentDate.getDate()

      if (dayOfMonth >= 1 && dayOfMonth <= 15) {
        startDate = startOfMonth(currentDate); 
        endDate =  endOfDay(setDate(currentDate, 15)); 
      } else {
        startDate = startOfDay(setDate(currentDate, 16)); 
        endDate = endOfMonth(currentDate); 
      }
    }

    if (frequency === BudgetFrecuency.WEEKLY) {
      startDate = startOfWeek(currentDate, {weekStartsOn: 1});
      endDate = endOfWeek(currentDate, { weekStartsOn: 1});
    }

    const newBudget = this.budgetRepository.create({startDate: subHours(startDate, 5), endDate: subHours(endDate, 5), category, total, user, type: BugdetType.FREQUENT, frequency});

    return await this.budgetRepository.save(newBudget);
  }

  async findAll() {
    return await this.budgetRepository.find();
  }

  async findOne(id: number) {
    const budget = await this.budgetRepository.findOne({ where: {id}, relations: ['user']});
    if(!budget) throw new NotFoundException('Budget was not found');
    return budget;
  }

  async findByUser(user: User) {

    return await this.budgetRepository.find({ where: { user: {id: user.id} }, relations: ['user']});
  }

  async update(id: number, newTotal: number, user: User) {
    const budget = await this.findOne(id);

    if(budget.user.id != user.id) throw new UnauthorizedException('You are not allowed to update this budget');

    const currentDate = new Date();

    if (!isWithinInterval(currentDate, { start: budget.startDate, end: budget.endDate })) throw new BadRequestException('You can only update current budgets')

    return await this.budgetRepository.update(id, { total: newTotal });
  }


  async remove(id: number, user: User) {   

    const budget = await this.findOne(id);

    if(budget.user.id != user.id) throw new UnauthorizedException('You are not allowed to remove this budget');

    return await this.budgetRepository.delete(id);
  }
}
