// src/entities/investment.entity.ts
import { AbstractEntity } from 'src/core/entities/abstract.entity';
import { InvestmentProject } from 'src/investment-projects/entities/investment-project.entity';
import { Investor } from 'src/investors/entities/investor.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity('investments')
export class Investment extends AbstractEntity {
  @ManyToOne(() => Investor, (investor) => investor.investments)
  investor: Investor;

  @ManyToOne(() => InvestmentProject, (project) => project.investments)
  project: InvestmentProject;

  @Column({ type: 'int' })
  shares: number;

  @Column({ type: 'decimal' })
  amount: number;

  @Column({ type: 'decimal', name: 'estimated_monthly_return' })
  estimatedMonthlyReturn: number;
}
