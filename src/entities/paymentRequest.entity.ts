import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity({ name: 'payment_requests' })
export class PaymentRequest {

    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    id: number;

    @Column('uuid', { nullable: true })
    user_id?: string | null;

    @Column({ type: 'varchar', nullable: true })
    reference_id: string;

    @Column({ type: 'varchar', nullable: true })
    request_body: string;

    @Column({ type: 'varchar', nullable: true })
    response_body: string;

    @Column({ type: 'smallint', default: 0})
    status_code: number;

    @Column({ type: 'timestamp', nullable: true })
    @CreateDateColumn()
    created_at: Date;

}
