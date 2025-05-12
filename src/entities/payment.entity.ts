import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity({ name: 'payments' })
export class Payment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', nullable: true })
    reference_id: string;

    @Column({ type: 'varchar', nullable: true })
    transaction_id: string;

    @Column('decimal')
    amount: number;

    @Column({ type: 'varchar', nullable: true })
    via: string;

    @Column({ type: 'varchar', nullable: true })
    channel: string;


    @Column({ default: 'PENDING' })
    status: 'PENDING' | 'SUCCESS' | 'FAILED';

    @Column({ type: 'varchar', nullable: true })
    meta_data: string;

    @CreateDateColumn()
    created_at: Date;

    @Column({ type: 'timestamp', nullable: true })
    payment_at: Date;
}
