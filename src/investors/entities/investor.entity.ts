import { Investment } from 'src/investments/entities/investment.entity';
import { Payment } from 'src/payments/entities/payment.entity';
import { User } from 'src/users/user.entity';
import { Entity, JoinTable, OneToMany } from 'typeorm';

@Entity('investors')
export class Investor extends User {
  @OneToMany(() => Investment, (investment) => investment.investor)
  @JoinTable()
  investments: Investment[];

  @OneToMany(() => Payment, (p) => p.investor)
  payments: Payment[];
}
