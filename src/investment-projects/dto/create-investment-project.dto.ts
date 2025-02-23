import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsDecimal, IsPositive, Min } from 'class-validator';

export class CreateInvestmentProjectDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsDecimal()
  @Min(0)
  totalAmount: number;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  availableShares: number;

  @ApiProperty()
  @IsDecimal()
  @Min(0)
  sharePrice: number;

  @ApiProperty()
  @IsDecimal()
  @IsPositive()
  expectedReturn: number;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  duration: number;
}
