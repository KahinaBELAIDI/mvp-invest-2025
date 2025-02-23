import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Investment } from './entities/investment.entity';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { UpdateInvestmentDto } from './dto/update-investment.dto';

@Injectable()
export class InvestmentsService {
  constructor(
    @InjectRepository(Investment)
    private readonly investmentRepository: Repository<Investment>,
  ) {}

  create(dto: CreateInvestmentDto): Promise<Investment> {
    return this.investmentRepository.save(dto);
  }

  async update(id: string, dto: UpdateInvestmentDto): Promise<Investment> {
    const investment = await this.investmentRepository.findOneBy({ id });
    if (!investment) throw new NotFoundException('Investment not found');
    return this.investmentRepository.save({ id, dto });
  }

  async findOne(id: string): Promise<Investment> {
    const investment = await this.investmentRepository.findOne({
      where: { id },
      relations: ['investor', 'project'],
    });
    if (!investment) throw new NotFoundException('Investment not found');
    return investment;
  }
}
