import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { dataSourceOptions } from './config/typeorm.config';
import { CoreModule } from './core/core.module';
import { InvestmentProjectModule } from './investment-projects/investment-project.module';
import { InvestmentsModule } from './investments/investments.module';
import { InvestorsModule } from './investors/investors.module';
import { PaymentsModule } from './payments/payments.module';

import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    InvestmentProjectModule,
    CoreModule,
    InvestorsModule,
    InvestmentsModule,

    PaymentsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
