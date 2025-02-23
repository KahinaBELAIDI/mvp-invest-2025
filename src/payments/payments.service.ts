import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Payment, PaymentStatus } from 'src/payments/entities/payment.entity';
import { Repository } from 'typeorm';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  // Method to handle the creation of an investment payment and link it to the investment
  async create(dto: CreatePaymentDto): Promise<any> {
    return this.paymentRepository.save(dto);
  }

  async completePayment(paymentId: string) {
    const payment = await this.paymentRepository.findOne({
      where: { id: paymentId },
      relations: ['project', 'investor'],
    });

    if (!payment) {
      throw new Error('Payment not found');
    }

    // Mark the payment as completed
    payment.status = PaymentStatus.COMPLETED;
    await this.paymentRepository.save(payment);

    //generate return payments
    if (payment.type === 'investment') {
      await this.generateReturns(payment);
    }
  }

  private async generateReturns(payment: Payment) {
    const { project, investor, amount } = payment;

    if (!project || !investor) {
      throw new Error('Project or investor not found for return calculation');
    }

    const monthlyReturn =
      ((project.expectedReturn / 100) * amount) / project.duration;

    for (let i = 1; i <= project.duration; i++) {
      const returnPayment = this.paymentRepository.create({
        amount: monthlyReturn,
        status: PaymentStatus.PENDING,
        transactionId: null, // To get from payment third party
        project,
        investor,
        type: 'return',
      });

      await this.paymentRepository.save(returnPayment);
    }
  }
  // Method to get all payments for an investor
  async getInvestorPayemnts(investorId: string): Promise<Payment[]> {
    return this.paymentRepository.find({
      where: { investor: { id: investorId } },
      relations: ['project', 'investor'],
    });
  }
}
