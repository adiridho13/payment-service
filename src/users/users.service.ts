// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly repo: Repository<User>,
    ) {}

    /** Cari user berdasarkan username */
    async findByUsername(username: string): Promise<User | null> {
        return this.repo.findOneBy({ username });
    }

    /** Cari user berdasarkan ID */
    async findById(id: string): Promise<User | null> {
        return this.repo.findOneBy({ id });
    }

    /** (Baru) List semua user */
    async findAll(): Promise<User[]> {
        return this.repo.find();
    }

    /** Buat user baru */
    async createUser(
        username: string,
        password: string,
        role = 'user',
    ): Promise<User> {
        const user = this.repo.create({ username, password, role });
        return this.repo.save(user);
    }
}
