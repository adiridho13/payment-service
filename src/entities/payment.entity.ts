import {
    Entity,
    PrimaryColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Index, PrimaryGeneratedColumn,
} from 'typeorm';

export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED';

// Transformer DECIMAL → number
const DecimalToNumber = {
    to: (v: number) => v,
    from: (v: string | null) => (v ? Number(v) : 0),
};

@Entity({ name: 'payments' })
export class Payment {
    // id varchar(36)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // amount decimal(15,2)
    @Column('decimal', {
        precision: 15,
        scale: 2,
        default: 0,
        transformer: DecimalToNumber,
    })
    amount: number;

    @Column({ name: 'payment_at', type: 'timestamp', nullable: true })
    paymentAt: Date | null;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;

    @Index('idx_payments_reference_id')
    @Column({ name: 'reference_id', type: 'varchar', length: 100, nullable: true })
    referenceId: string | null;

    @Index('idx_payments_transaction_id')
    @Column({ name: 'transaction_id', type: 'varchar', length: 100, nullable: true })
    transactionId: string | null;

    @Column({ name: 'via', type: 'varchar', length: 50, nullable: true })
    via: string | null;

    @Column({ name: 'channel', type: 'varchar', length: 50, nullable: true })
    channel: string | null;

    @Column({
        name: 'status',
        type: 'enum',
        enum: ['PENDING', 'SUCCESS', 'FAILED'],
        default: 'PENDING',
    })
    status: PaymentStatus;

    @Column({ name: 'meta_data', type: 'longtext', nullable: true })
    metaData: string | null;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;
}
