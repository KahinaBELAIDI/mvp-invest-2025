import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateInvestmentProjectDto } from '../dto/create-investment-project.dto';
import { InvestmentProjectService } from '../investment-project.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Roles } from 'src/core/decorators/roles.decorator';
import { UserRole } from 'src/users/user.entity';

@Controller('admin/projects')
@ApiTags('Investment Projects')
@UseGuards(AuthGuard)
export class InvestmentProjectAdminController {
  constructor(
    private readonly investmentProjectService: InvestmentProjectService,
  ) {}
  @Roles(UserRole.ADMIN)
  @Post()
  create(@Body() createInvestmentProjectDto: CreateInvestmentProjectDto) {
    return this.investmentProjectService.create(createInvestmentProjectDto);
  }
  @Roles(UserRole.ADMIN)
  @Get()
  findAll() {
    return this.investmentProjectService.findAll();
  }
  @Roles(UserRole.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.investmentProjectService.findOne(id);
  }
  @Roles(UserRole.ADMIN)
  @Patch(':id/publish')
  publish(@Param('id') id: string) {
    return this.investmentProjectService.publish(id);
  }
}
