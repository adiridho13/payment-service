import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'payment_requests' })
export class PaymentRequest {
    // BIGINT AI — gunakan string agar tidak kehilangan presisi dari mysql2
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: string;

    @Column({ name: 'user_id', type: 'varchar', length: 255, nullable: true })
    user_id: string | null;

    @Column({ name: 'reference_id', type: 'varchar', length: 255, nullable: true })
    reference_id: string | null;

    @Column({ name: 'response_body', type: 'longtext', nullable: true }) // atau 'varchar', tapi longtext lebih aman
    response_body: string | null;

    @Column({ name: 'request_body', type: 'longtext', nullable: true })
    request_body: string | null;

    @Column({ name: 'status_code', type: 'smallint', default: 0 })
    status_code: number;

    // datetime(6) = current_timestamp(6)
    @CreateDateColumn({ name: 'created_at', type: 'datetime', precision: 6 })
    created_at: Date;
}
