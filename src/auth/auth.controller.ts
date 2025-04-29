// auth.controller.ts
import {
    Controller,
    Post,
    Body,
    Res,
    UnauthorizedException, HttpCode,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @HttpCode(200)
    async login(
        @Body() dto: LoginDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const user = await this.authService.validateUser(dto.username, dto.password);
        if (!user) {
            throw new UnauthorizedException('Username atau password salah');
        }
        const { access_token } = await this.authService.login(dto);

        res.cookie('jwt', access_token, {
            httpOnly: true,             // tidak bisa diakses JS
            secure: process.env.NODE_ENV === 'production',  // hanya lewat HTTPS
            sameSite: 'lax',            // atau 'strict' jika perlu kontrol lebih ketat
            maxAge: 24 * 60 * 60 * 1000, // umur cookie 1 hari (ms)
        });
        return {
            ok: true,
            message: 'Login berhasil',
        };
    }
}
