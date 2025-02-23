import { IsInt, IsNumber } from 'class-validator';
import { InvestmentProject } from 'src/investment-projects/entities/investment-project.entity';
import { Investor } from 'src/investors/entities/investor.entity';

export class CreateInvestmentDto {
  investor: Investor;

  project: InvestmentProject;

  @IsInt()
  shares: number;

  @IsNumber()
  amount: number;

  @IsNumber()
  estimatedMonthlyReturn: number;
}
