import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Public } from 'src/core/decorators/public.decorator';
import { Roles } from 'src/core/decorators/roles.decorator';
import { UserRole } from 'src/users/user.entity';
import { CreateInvestorDto } from '../dto/create-investor.dto';
import { Investor } from '../entities/investor.entity';
import { InvestorsService } from '../investors.service';

@Controller('admin/investors')
@ApiTags('Investors')
@UseGuards(AuthGuard)
export class InvestorsAdminController {
  constructor(private readonly investorService: InvestorsService) {}

  // Endpoint to get a single investor by ID
  @ApiOperation({ summary: 'Get an investor detail by id' })
  @Roles(UserRole.ADMIN)
  @Get(':id')
  async getInvestorById(@Param('id') id: string): Promise<Investor> {
    return this.investorService.findOne(id);
  }

  // Endpoint to get all investors

  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all new investors' })
  @Get()
  async getAllInvestors(@Query() query) {
    const { take, page } = query;
    return this.investorService.findAll(take, page);
  }

  @ApiOperation({ summary: 'Create a new investor' })
  @Public() //TODO not sure about the entry point of this action, if it's via public signup or an admin action
  @Post()
  async createInvestor(
    @Body() createInvestorDto: CreateInvestorDto,
  ): Promise<Investor> {
    return this.investorService.create(createInvestorDto);
  }
}
