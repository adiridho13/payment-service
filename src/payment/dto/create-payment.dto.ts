import { IsNumber, IsString } from 'class-validator';

export class CreatePaymentDto {
    @IsString()
    name: string;
    @IsString()
    phone: string;
    @IsString()
    email: string;
    @IsNumber()
    amount: number;
    @IsString()
    comments: string;
    @IsString()
    notifyUrl: string;
    @IsString()
    referenceId: string;
    @IsString()
    paymentMethod: string;
    @IsString()
    paymentChannel: string;
}
