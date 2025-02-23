import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsUUID } from 'class-validator';
import { InvestmentProject } from 'src/investment-projects/entities/investment-project.entity';

export class PurchaseSharesDto {
  @ApiProperty()
  @IsUUID()
  projectId: string;

  @ApiProperty()
  @IsInt()
  shares: number;
}
