import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { IJwtPayload } from 'src/common/interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private usersRepository: Repository<User>,
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService

    ) { }

    
    async register(registerUserDto: RegisterUserDto) {

        const existingUser = await this.usersService.findOneByEmail(registerUserDto.email);

        if (existingUser) throw new ConflictException('Email already registered');

        const hashedPassword = await this.hashPassword(registerUserDto.password);

        const newUser = this.usersRepository.create({ ...registerUserDto, password: hashedPassword });

        return await this.usersRepository.save(newUser);
    }

    
    async hashPassword(password: string) {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    }

    async login(loginDto: LoginDto) {
        const user = await this.usersService.findOneByEmail(loginDto.email);
        if (!user) throw new BadRequestException('Credentials are not valid');

        const comparePassword = await bcrypt.compare(loginDto.password, user.password);

        if (!comparePassword) throw new BadRequestException('Credentials are not valid');

        const token = await this.generateToken(user);

        return token;
    }

    async generateToken(user: User) {

        const payload: IJwtPayload = { id: user.id, email: user.email, name: user.name }

        return this.jwtService.sign(payload);
    }
}