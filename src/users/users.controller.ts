// src/users/users.controller.ts
import {
    Controller,
    Get,
    Post,
    Param,
    Body,
    NotFoundException,
    UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    /**
     * GET /users
     * (Protected) List semua user
     */
    // @UseGuards(JwtAuthGuard)
    @Get()
    async findAll() {
        const users = await this.usersService.findAll();
        return users.map(({ password, ...rest }) => rest);
    }

    /**
     * GET /users/:username
     * (Protected) Cari user berdasarkan username
     */
    // @UseGuards(JwtAuthGuard)
    @Get(':username')
    async findOne(@Param('username') username: string) {
        const user = await this.usersService.findByUsername(username);
        if (!user) {
            throw new NotFoundException(`User "${username}" tidak ditemukan`);
        }
        const { password, ...rest } = user;
        return rest;
    }

    /**
     * POST /users
     * (Public) Buat user baru
     */
    @Post()
    async create(@Body() dto: CreateUserDto) {
        // CreateUserDto sudah mem-validasi username/password
        const newUser = await this.usersService.createUser(
            dto.username,
            dto.password,
            dto.role,
        );
        const { password, ...rest } = newUser;
        return rest;
    }
}
