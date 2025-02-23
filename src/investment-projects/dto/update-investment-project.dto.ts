import { PartialType } from '@nestjs/mapped-types';
import { CreateInvestmentProjectDto } from './create-investment-project.dto';

export class UpdateInvestmentProjectDto extends PartialType(CreateInvestmentProjectDto) {}
