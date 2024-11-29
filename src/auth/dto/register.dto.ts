import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsOptional, IsString, IsStrongPassword } from "class-validator";

export class RegisterUserDto {
    @ApiProperty({ name: 'name', example: 'Lulú'})
    @IsString()
    name: string;

    @ApiProperty({ name: 'email', example: 'lulu@gmail.com'})
    @IsEmail()
    email: string;

    @ApiProperty({ name: 'password', example: 'MyPassword.123'})
    @IsStrongPassword()
    password: string;
}