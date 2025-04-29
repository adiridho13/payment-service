import { Module } from '@nestjs/common';
import { ConfigModule as CM } from '@nestjs/config';
import { validationSchema } from './config.schema';

@Module({
    imports: [
        CM.forRoot({
            isGlobal: true,
            validationSchema,
        }),
    ],
})
export class ConfigModule {}
