import { Module } from '@nestjs/common';
import { InvestmentProjectService } from './investment-project.service';
import { InvestmentProjectController } from './controllers/investment-project.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvestmentProject } from './entities/investment-project.entity';
import { InvestmentProjectAdminController } from './controllers/investment-projects.admin.controller';

@Module({
  imports: [TypeOrmModule.forFeature([InvestmentProject])],
  controllers: [InvestmentProjectController, InvestmentProjectAdminController],
  providers: [InvestmentProjectService],
  exports: [InvestmentProjectService],
})
export class InvestmentProjectModule {}
