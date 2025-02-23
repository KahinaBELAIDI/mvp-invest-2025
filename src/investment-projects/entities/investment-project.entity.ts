import { AbstractEntity } from 'src/core/entities/abstract.entity';
import { Investment } from 'src/investments/entities/investment.entity';
import { Payment } from 'src/payments/entities/payment.entity';
import { Column, Entity, OneToMany } from 'typeorm';

export enum ProjectStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  CLOSED = 'closed',
}

@Entity('investment_projects')
export class InvestmentProject extends AbstractEntity {
  @Column()
  name: string;

  @Column({ type: 'decimal', name: 'total_amount' })
  totalAmount: number;

  @Column({ type: 'int', name: 'available_shares' })
  availableShares: number;

  @Column({ type: 'decimal', name: 'share_price' })
  sharePrice: number;

  @Column({ type: 'decimal', name: 'expected_return' })
  expectedReturn: number; //  a percentage

  @Column({ type: 'int' })
  duration: number; // in months

  @Column({
    type: 'enum',
    enum: ProjectStatus,
    default: ProjectStatus.DRAFT,
  })
  status: ProjectStatus;

  @OneToMany(() => Investment, (investment) => investment.project)
  investments: Investment[];

  @OneToMany(() => Payment, (p) => p.project)
  payments: Payment[];
}
