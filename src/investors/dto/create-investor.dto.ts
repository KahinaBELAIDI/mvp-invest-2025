import { IsString, IsEmail } from 'class-validator';

export class CreateInvestorDto {
  @IsString()
  firstname: string;

  @IsString()
  lastname: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
