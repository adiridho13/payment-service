import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';  // jika Anda punya controller
import { User } from './users.entity';

@Module({
    imports: [
        // Daftarkan entity User ke TypeORM agar bisa InjectRepository
        TypeOrmModule.forFeature([User]),
    ],
    providers: [
        UsersService,          // business logic untuk user
    ],
    controllers: [
        UsersController,       // endpoint HTTP untuk user (jika diperlukan)
    ],
    exports: [
        UsersService,          // agar bisa dipakai di AuthModule, PaymentModule, dll.
    ],
})
export class UsersModule {}
