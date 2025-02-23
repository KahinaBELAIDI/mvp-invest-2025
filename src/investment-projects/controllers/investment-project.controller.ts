import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InvestmentProjectService } from '../investment-project.service';

@Controller('projects')
@ApiTags('Investment Projects')
export class InvestmentProjectController {
  constructor(
    private readonly investmentProjectService: InvestmentProjectService,
  ) {}

  @Get()
  findAvailableProjects(@Query() query) {
    const { take, page } = query;
    return this.investmentProjectService.findAvailableProjects(take, page);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.investmentProjectService.findOne(id);
  }

  @Post()
  purchase() {}
}
