import { Module } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import {AuthService} from "./auth.service";
import { JwtModule } from '@nestjs/jwt';
import {JwtStrategy} from "./jwt.strategy";
import {AuthController} from "./auth.controller";
import {UsersModule} from "../users/users.module";

@Module({
    imports: [
        ConfigModule,                       // untuk ConfigService
        PassportModule.register({ defaultStrategy: 'jwt' }),                    // passport boilerplate
        JwtModule.registerAsync({           // konfigurasi JWT dinamis
            imports: [ConfigModule],
            useFactory: (cfg: ConfigService) => ({
                secret: cfg.get<string>('JWT_SECRET'),
                signOptions: { expiresIn: cfg.get<string>('JWT_EXPIRES_IN') },
            }),
            inject: [ConfigService],
        }),
        UsersModule,
    ],
    providers: [AuthService, JwtStrategy],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule {}
