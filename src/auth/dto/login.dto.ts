import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
    @IsString()
    @IsNotEmpty()
    username: string;
    @IsNotEmpty()
    @IsString()
    password: string;
}