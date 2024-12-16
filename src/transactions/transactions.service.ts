import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { BudgetsService } from 'src/budgets/budgets.service';
import { Budget } from 'src/budgets/entities/budget.entity';
import { TransactionType } from 'src/common/enums/transations.enum';
import { addHours, addMinutes, endOfDay, format, isAfter, isBefore, isSameDay, isWithinInterval, startOfDay, subHours } from 'date-fns';
import { TransactionsQueryDto } from 'src/budgets/dto/transactions-query.dto';
import { CategoriesService } from 'src/categories/categories.service';
import { toZonedTime } from 'date-fns-tz';
import { es } from "date-fns/locale"

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction) private transactionRepository: Repository<Transaction>,
    private budgetsService: BudgetsService,
    private categoriesService: CategoriesService
  ){}

  async create(createTransactionDto: CreateTransactionDto, user: User) {
    const budget = await this.budgetsService.findOne(createTransactionDto.budgetId);

    if(budget.user.id != user.id) throw new UnauthorizedException('You are not allowed for this action');

    if(createTransactionDto.type === TransactionType.BUDGET) {
      const newTotal = budget.total + createTransactionDto.total;
      const newTotalBudget = await this.budgetsService.update(budget.id, newTotal, user);
      console.log(newTotalBudget)
    }

    const currentDate = new Date();

    const newTransaction = this.transactionRepository.create({
      ...createTransactionDto,
      date: subHours(currentDate, 5),
      budget
    });

    return await this.transactionRepository.save(newTransaction);
  }

  async findAll() {
    return await this.transactionRepository.find();
  }

  async findUserTransactions(user: User, transactionQuery: TransactionsQueryDto) {   

    const query = this.transactionRepository.createQueryBuilder('transaction')
    .leftJoinAndSelect('transaction.budget', 'budget')
    .leftJoinAndSelect('budget.category', 'category')

    .where('budget.user.id = :userId', {userId: user.id})

    const {categoryId, type, startDate, endDate, current, budgetId} = transactionQuery

    if(categoryId) {
      const category = await this.categoriesService.findOne(categoryId);
      query.andWhere('budget.category.id = :categoryId', {categoryId: category.id});
    }

    if(budgetId) {
      const budget = await this.budgetsService.findOne(budgetId);
      query.andWhere('budget.id = :budgetId', {budgetId});
    }

    if(type) {
      query.andWhere('transaction.type = :type', {type});
    }

    let transactions: Transaction[] = await query.getMany();

    if(current) {
      const currentBudget = await this.budgetsService.findByUser(user, {current: true, categoryId: null})
      const {startDate} = currentBudget.reduce((budget, acumm) => isBefore(acumm.startDate, budget.startDate) ? acumm : budget)
      const {endDate} = currentBudget.reduce((budget, acumm) => isAfter(acumm.startDate, budget.startDate) ? acumm : budget)

      transactions = transactions.filter(transaction => isWithinInterval(transaction.date, { start: startDate, end: endDate  }))
    }

    if(startDate) {
      transactions = transactions.filter(transaction => isAfter(transaction.date, startDate))
    }

    if(endDate) {

      transactions = transactions.filter(transaction => isBefore(transaction.date, addMinutes(addHours(endDate, 23), 59)))
    }

    const sortedTransactions = this.sortByDate(transactions);

    // const formattedDates = sortedTransactions.map(transaction => {
    //    console.log(format(transaction.date, "MMMM d", {
    //     locale: es
    //    }))
    // })

    return sortedTransactions;
  }

  sortByDate(transactions: Transaction[]) {
    return transactions.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }

  async findOne(id: number) {
    const transaction = await this.transactionRepository.findOne({ where: {id}});
    if(!transaction) throw new NotFoundException('Transaction was not found');
    return transaction;
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
