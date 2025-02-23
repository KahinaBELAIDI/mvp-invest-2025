import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Investor } from './entities/investor.entity';
import { CreateInvestorDto } from './dto/create-investor.dto';
import { UpdateInvestorDto } from './dto/update-investor.dto'; // DTO for updating an investor
import { UserRole } from 'src/users/user.entity';
import * as bcrypt from 'bcrypt';
import { InvestmentProjectService } from 'src/investment-projects/investment-project.service';
import { InvestmentsService } from 'src/investments/investments.service';
import { PaymentStatus } from 'src/payments/entities/payment.entity';
import { PaymentsService } from 'src/payments/payments.service';
@Injectable()
export class InvestorsService {
  constructor(
    @InjectRepository(Investor)
    private readonly investorRepository: Repository<Investor>,
    private readonly projectsService: InvestmentProjectService,
    private readonly investmentsService: InvestmentsService,
    private readonly paymentsService: PaymentsService,
  ) {}

  // Find one investor by ID
  async findOne(id: string): Promise<Investor> {
    const investor = await this.investorRepository.findOne({
      where: { id },
      relations: ['investments'],
    });
    if (!investor) {
      throw new NotFoundException(`Investor with ID ${id} not found`);
    }
    return { ...investor, passwordHash: undefined };
  }

  async findOneByEmail(email: string): Promise<Investor> {
    const investor = await this.investorRepository.findOne({
      where: { email },
    });
    if (!investor) {
      throw new NotFoundException(`Investor not found`);
    }
    return investor;
  }

  // Find all investors
  async findAll(take: number = 20, page: number = 1) {
    const [investors, total] = await this.investorRepository.findAndCount({
      relations: ['investments'],
      take,
      skip: (page - 1) * take,
    });

    return {
      data: investors,
      total,
      page,
      totalPages: Math.ceil(total / take),
    };
  }

  async create(createInvestorDto: CreateInvestorDto): Promise<Investor> {
    const { email, firstname, lastname, password } = createInvestorDto;

    // Check if the email already exists (optional, skip if not necessary)
    const existingUser = await this.investorRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException(
        `Investor with email ${email} already exists`,
      );
    }
    let pwdHash = await bcrypt.hash(
      password,
      parseInt(process.env.SALT_ROUNDS) || 10,
    );
    const investor = this.investorRepository.create({
      firstname,
      lastname,
      email,
      passwordHash: pwdHash,
      role: UserRole.INVESTOR,
    });

    return this.investorRepository.save(investor);
  }

  // Update investor by ID
  async update(
    id: string,
    updateInvestorDto: UpdateInvestorDto,
  ): Promise<Investor> {
    const investor = await this.investorRepository.findOne({
      where: { id },
    });

    if (!investor) {
      throw new NotFoundException(`Investor with ID ${id} not found`);
    }

    // Update fields
    const updatedInvestor = Object.assign(investor, updateInvestorDto);

    return this.investorRepository.save(updatedInvestor);
  }

  // Hard delete investor by ID (permanent deletion from the database)
  async hardDelete(id: string): Promise<void> {
    const investor = await this.investorRepository.findOne({
      where: { id },
    });

    if (!investor) {
      throw new NotFoundException(`Investor with ID ${id} not found`);
    }

    await this.investorRepository.remove(investor);
  }

  async purchaseShares(investorId: string, projectId: string, shares: number) {
    const investor = await this.investorRepository.findOneBy({
      id: investorId,
    });
    if (!investor)
      throw new NotFoundException('Specified Investor does not exist');

    const project = await this.projectsService.findOne(projectId);
    console.log('🚀 ~ InvestorsService ~ purchaseShares ~ project:', project);

    if (!project) {
      throw new NotFoundException(
        'Project not found or not available for investment',
      );
    }

    if (project.availableShares < shares) {
      throw new BadRequestException('Not enough shares available');
    }

    const amount = shares * Number(project.sharePrice);
    const expectedReturn =
      ((project.expectedReturn / 100) * amount) / project.duration;

    // Create investment record
    const investment = this.investmentsService.create({
      investor: investor,
      project: project,
      shares,
      amount,
      estimatedMonthlyReturn: expectedReturn,
    });

    // Update project shares
    project.availableShares -= shares;
    await this.projectsService.update(projectId, project);

    // Create the payment record
    const payment = await this.paymentsService.create({
      amount,
      status: PaymentStatus.PENDING,
      type: 'investment',
      investor: investor,
      project: project,
    });
    return { investment, payment };
  }

  async getPortfolio(investorId: string) {
    const investor = await this.investorRepository
      .createQueryBuilder('investor')
      .leftJoinAndSelect('investor.investments', 'investment')
      .leftJoinAndSelect('investment.project', 'project')
      .where('investor.id = :investorId', { investorId })
      .select([
        'investor.id',

        'investment.id',
        'investment.shares',
        'investment.amount',
        'investment.estimatedMonthlyReturn',
        'project.id',
        'project.name',
        'project.expectedReturn',
        'project.duration',
      ])
      .getOne();

    if (!investor) {
      throw new NotFoundException('Investor not found');
    }
    const { investments } = investor;

    const totalShares = investments.reduce((sum, inv) => sum + inv.shares, 0);
    const totalInvested = investments.reduce(
      (sum, inv) => sum + Number(inv.amount),
      0,
    );
    const estimatedMonthlyReturn = investments.reduce(
      (sum, inv) => sum + Number(inv.estimatedMonthlyReturn),
      0,
    );

    return {
      totalShares,
      totalInvested,
      estimatedMonthlyReturn,
      investments,
    };
  }
}
