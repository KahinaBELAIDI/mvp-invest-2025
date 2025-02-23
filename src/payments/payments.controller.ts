import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentsService } from './payments.service';
import { Roles } from 'src/core/decorators/roles.decorator';
import { UserRole } from 'src/users/user.entity';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('payments')
@ApiTags('Payments')
@UseGuards(AuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Roles(UserRole.INVESTOR)
  @Post()
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.create(createPaymentDto);
  }

  @Roles(UserRole.INVESTOR)
  @Patch(':id/complete')
  update(@Param('id') id: string) {
    return this.paymentsService.completePayment(id);
  }
}
