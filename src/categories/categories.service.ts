import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category) private categoryRepository: Repository<Category>,
    private usersService: UsersService,
  ){}

  async create(createCategoryDto: CreateCategoryDto, currentUser: User) {
    if (!createCategoryDto.isCustom) {
      const newCategory = this.categoryRepository.create(createCategoryDto);
      return await this.categoryRepository.save(newCategory);
    }

    const user = await this.usersService.findOneById(currentUser.id);

    const newCategory = this.categoryRepository.create({...createCategoryDto, user});
    return await this.categoryRepository.save(newCategory);
  }

  async findAll() {
    return await this.categoryRepository.find();
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findOne({ where: {id}, relations: ['user']});
    if(!category) throw new NotFoundException('Category was not found');
    return category;
  }

  async findByUserId(id: number) {
    const user = await this.usersService.findOneById(id);
    const query = this.categoryRepository.createQueryBuilder('category')
    .leftJoinAndSelect('category.user', 'user')
    .where('category.isCustom = :isCustom', {isCustom: false})
    .orWhere('user.id = :userId', { userId: user.id})

    return await query.getMany();
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  async remove(id: number, userId: number) {
    const category = await this.findOne(id);

    if (!category.isCustom) throw new UnauthorizedException('You cannot delete this category');
    
    const user = await this.usersService.findOneById(userId);

    if(category.user.id != user.id) throw new UnauthorizedException('You cannot delete this category');

    return await this.categoryRepository.delete(id);
  }
}
