import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity({ name: 'payments' })
export class Payment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', nullable: true })
    referenceId: string;

    @Column({ type: 'varchar', nullable: true })
    transactionId: string;

    @Column('decimal')
    amount: number;

    @Column({ default: 'PENDING' })
    status: 'PENDING' | 'SUCCESS' | 'FAILED';

    @CreateDateColumn()
    createdAt: Date;
}
