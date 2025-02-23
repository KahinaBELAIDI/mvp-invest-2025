import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Roles } from 'src/core/decorators/roles.decorator';
import { UserRole } from 'src/users/user.entity';
import { PurchaseSharesDto } from '../dto/purchase-shares.dto';
import { Investor } from '../entities/investor.entity';
import { InvestorsService } from '../investors.service';

@Controller('investors')
@ApiTags('Investors')
@UseGuards(AuthGuard)
@Roles(UserRole.INVESTOR)
export class InvestorsController {
  constructor(private readonly investorService: InvestorsService) {}

  @Post('invest')
  async purchaseShares(@Body() body: PurchaseSharesDto, @Req() req) {
    return this.investorService.purchaseShares(
      req.user.id,
      body.projectId,
      body.shares,
    );
  }

  @Get(':id')
  async getInvestorPortfolio(@Param('id') id: string, @Req() req) {
    const loggedUserid = req.user.id;

    if (id != loggedUserid) throw new ForbiddenException('Forbidden access');
    return this.investorService.getPortfolio(id);
  }
}
