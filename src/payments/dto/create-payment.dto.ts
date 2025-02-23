import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { Investor } from 'src/investors/entities/investor.entity';
import { PaymentStatus } from '../entities/payment.entity';
import { InvestmentProject } from 'src/investment-projects/entities/investment-project.entity';

export class CreatePaymentDto {
  @ApiProperty({})
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({
    enum: PaymentStatus,
    example: PaymentStatus.PENDING,
    required: false,
  })
  @IsEnum(PaymentStatus)
  @IsOptional()
  status?: PaymentStatus; // Defaults to PENDING in the entity

  @ApiProperty({
    example: 'txn_123456789',
    required: false,
  })
  @IsString()
  @IsOptional()
  transactionId?: string;

  @ApiProperty({
    enum: ['investment', 'return'],
    example: 'investment',
  })
  @IsEnum(['investment', 'return'])
  @IsNotEmpty()
  type: 'investment' | 'return'; // Defines if it's an investment payment or a return payment

  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => InvestmentProject)
  project: InvestmentProject;

  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Investor)
  investor: Investor;
}
