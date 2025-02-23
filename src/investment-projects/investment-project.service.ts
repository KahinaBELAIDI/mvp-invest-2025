import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateInvestmentProjectDto } from './dto/create-investment-project.dto';
import { UpdateInvestmentProjectDto } from './dto/update-investment-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  InvestmentProject,
  ProjectStatus,
} from './entities/investment-project.entity';
import { Repository } from 'typeorm';

@Injectable()
export class InvestmentProjectService {
  constructor(
    @InjectRepository(InvestmentProject)
    private readonly projectsRepository: Repository<InvestmentProject>,
  ) {}

  // Create a new investment project
  async create(
    createInvestmentProjectDto: CreateInvestmentProjectDto,
  ): Promise<InvestmentProject> {
    const { name, totalAmount, availableShares, expectedReturn, duration } =
      createInvestmentProjectDto;

    // Check if the project name already exists
    const existingProject = await this.projectsRepository.findOne({
      where: { name },
    });
    if (existingProject) {
      throw new ConflictException(`Project with name ${name} already exists`);
    }
    const sharePrice = parseFloat(
      (Number(totalAmount) / Number(availableShares)).toFixed(4),
    );
    const project = this.projectsRepository.create({
      name,
      totalAmount,
      availableShares,
      expectedReturn,
      duration,
      sharePrice,
      status: ProjectStatus.DRAFT,
    });

    return this.projectsRepository.save(project);
  }

  // Find one investment project by ID
  async findOne(id: string): Promise<InvestmentProject> {
    const project = await this.projectsRepository.findOne({
      where: { id },
    });
    if (!project) {
      throw new NotFoundException(`Investment project with ID ${id} not found`);
    }
    return project;
  }

  // Find all investment projects
  async findAll(take: number = 20, page: number = 1) {
    const [projects, total] = await this.projectsRepository.findAndCount({
      take: take,
      skip: (page - 1) * take,
      order: { createdAt: 'DESC' }, // Optional: Order by creation date
    });

    return {
      total,
      page,
      take,
      totalPages: Math.ceil(total / take),
      data: projects,
    };
  }

  // Validate and publish the project (change status to PUBLISHED)
  async publish(id: string): Promise<InvestmentProject> {
    const project = await this.findOne(id);
    if (!project)
      throw new NotFoundException(`Project with ID ${id} not found`);

    // Validate required fields => il should be done in the front form validation also
    if (project.totalAmount <= 0) {
      throw new BadRequestException('Total amount must be greater than zero');
    }

    if (project.availableShares <= 0) {
      throw new BadRequestException(
        'Available shares must be greater than zero',
      );
    }

    if (project.expectedReturn <= 0) {
      throw new BadRequestException(
        'Expected return must be greater than zero',
      );
    }

    // Update project status to PUBLISHED
    project.status = ProjectStatus.PUBLISHED;
    return this.projectsRepository.save(project);
  }

  async findAvailableProjects(take: number = 20, page: number = 1) {
    const [projects, total] = await this.projectsRepository.findAndCount({
      where: {
        status: ProjectStatus.PUBLISHED,
      },
      take: take,
      skip: (page - 1) * take,
      order: { createdAt: 'DESC' },
    });

    return {
      total,
      page,
      take,
      totalPages: Math.ceil(total / take),
      data: projects,
    };
  }

  async update(id: string, data: UpdateInvestmentProjectDto) {
    const projct = await this.projectsRepository.findOneBy({ id });
    if (!projct) throw new NotFoundException('Project with this id not found');

    return this.projectsRepository.update(id, data);
  }
}
