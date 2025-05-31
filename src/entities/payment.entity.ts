import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED';

@Entity({ name: 'payments' })
export class Payment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // Jika Anda ingin properti tetap 'referenceId' di TypeScript,
    // tapi kolom di MariaDB bernama 'reference_id', tambahkan opsi 'name'.
    @Column({
        name: 'reference_id',
        type: 'varchar',
        length: 100,
        nullable: true,
    })
    referenceId: string | null;

    @Column({
        name: 'transaction_id',
        type: 'varchar',
        length: 100,
        nullable: true,
    })
    transactionId: string | null;

    // Tipe DECIMAL di MariaDB memerlukan precision dan scale.
    // Contoh: 15 digit total, 2 digit di belakang koma.
    @Column('decimal', { precision: 15, scale: 2, default: 0 })
    amount: number;

    @Column({ type: 'varchar', length: 50, nullable: true })
    via: string | null;

    @Column({ type: 'varchar', length: 50, nullable: true })
    channel: string | null;

    // Enum memastikan hanya nilai-nilai tertentu saja yang diterima.
    @Column({
        type: 'enum',
        enum: ['PENDING', 'SUCCESS', 'FAILED'],
        default: 'PENDING',
    })
    status: PaymentStatus;

    // Jika MariaDB Anda versi ≥ 10.2.7, bisa pakai tipe JSON.
    // Jika tidak, ganti 'json' menjadi 'text'.
    @Column({ name: 'meta_data', type: 'json', nullable: true })
    metaData: any | null;

    // Otomatis terisi CURRENT_TIMESTAMP ketika record dibuat
    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;

    // Jika perlu mencatat kapan pembayaran benar-benar terjadi
    @Column({ name: 'payment_at', type: 'timestamp', nullable: true })
    paymentAt: Date | null;

    // (Opsional) Jika ingin mencatat kapan record di‐update:
    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;
}
