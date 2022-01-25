import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from 'src/student/entities/student.entity';
import { StudentService } from 'src/student/student.service';
import { Repository } from 'typeorm';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { Plan } from './entities/plan.entity';
import { PlanNotFoundError } from './plan-not-found.error';

@Injectable()
export class PlanService {
  constructor(
    @InjectRepository(Plan)
    private planRepository: Repository<Plan>,
  ) {}

  create(createPlanDto: CreatePlanDto, student: Student): Promise<Plan> {
    const newPlan = this.planRepository.create({ ...createPlanDto, student });

    try {
      return this.planRepository.save(newPlan);
    } catch (_error) {
      throw new Error('Something went wrong when creating the new Plan');
    }
  }

  async findOne(id: number): Promise<Plan> {
    const plan = this.planRepository.findOne({
      where: { id },
      relations: ['student'],
    });

    if (!plan) {
      throw new PlanNotFoundError(id);
    }

    return plan;
  }

  async isPlanOwnedByStudent(
    planId: number,
    loggedInStudent: Student,
  ): Promise<boolean> {
    try {
      const { student: planOwner } = await this.findOne(planId);
      return StudentService.compareStudents(planOwner, loggedInStudent);
    } catch (_error) {
      /**
       * findOne failed probably since the plan doesn't exist. A plan that doesn't
       * exist isn't owner by the anyone so returning false.
       */
      return false;
    }
  }

  async update(id: number, updatePlanDto: UpdatePlanDto) {
    const updateResult = await this.planRepository.update(id, updatePlanDto);

    if (updateResult.affected === 0) {
      // no plan was updated, which implies a plan with the given id wasn't found
      throw new PlanNotFoundError(id);
    }

    return updateResult;
  }

  async remove(id: number) {
    const deleteResult = await this.planRepository.delete(id);

    if (deleteResult.affected === 0) {
      throw new PlanNotFoundError(id);
    }

    return deleteResult;
  }
}
