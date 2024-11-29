import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
    @ApiProperty({name: 'email', example: 'lulu@gmail.com'})
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({name: 'password', example: 'MyPassword.123'})
    @IsNotEmpty()
    @IsString()
    password: string;
}