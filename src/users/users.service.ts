import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) { }

  async findAll() {
    const users = await this.usersRepository.find();

    if (!users.length) throw new NotFoundException('No users were found');

    return users;
  }

  async findOneByEmail(email: string) {
    return await this.usersRepository.findOne({ where: { email } });
  }


  async findOneById(id: number) {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) throw new NotFoundException(`User with id ${id} was not found`);

    return user;
  }

}
