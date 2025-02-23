import { AbstractEntity } from 'src/core/entities/abstract.entity';
import { InvestmentProject } from 'src/investment-projects/entities/investment-project.entity';
import { Investor } from 'src/investors/entities/investor.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

@Entity('payments')
export class Payment extends AbstractEntity {
  @Column({ type: 'decimal' })
  amount: number; // Amount paid or received

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @Column({
    type: 'text',
    nullable: true,
    name: 'transaction_id',
  })
  transactionId: string;

  @ManyToOne(() => InvestmentProject, (investment) => investment.payments)
  @JoinColumn({ name: 'project_id' })
  project: InvestmentProject;

  @ManyToOne(() => Investor, (investor) => investor.payments)
  @JoinColumn({ name: 'investor_id' })
  investor: Investor; // Link to the investor who made the payment

  @Column({
    type: 'enum',
    enum: ['investment', 'return'],
    default: 'investment',
  })
  type: 'investment' | 'return'; //not sure about this column, shall we track the return payments? I mean the payment going out to the investors
}
