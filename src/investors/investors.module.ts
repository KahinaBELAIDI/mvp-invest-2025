import { Module } from '@nestjs/common';
import { InvestorsService } from './investors.service';
import { InvestorsController } from './controllers/investors.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Investor } from './entities/investor.entity';
import { InvestmentProjectModule } from 'src/investment-projects/investment-project.module';
import { InvestmentsModule } from 'src/investments/investments.module';
import { InvestorsAdminController } from './controllers/investors.admin.controller';
import { PaymentsModule } from 'src/payments/payments.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Investor]),
    InvestmentProjectModule,
    InvestmentsModule,
    PaymentsModule,
  ],
  controllers: [InvestorsController, InvestorsAdminController],
  providers: [InvestorsService],
  exports: [InvestorsService],
})
export class InvestorsModule {}
