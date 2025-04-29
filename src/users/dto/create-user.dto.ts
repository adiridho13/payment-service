import { IsString, MinLength, IsOptional } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @MinLength(4)
    username: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsOptional()
    @IsString()
    role?: string;
}
