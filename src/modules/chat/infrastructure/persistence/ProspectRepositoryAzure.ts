import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Domain
import { ProspectRepository } from '../../domain/ProspectRepository';
import { Prospect } from '../../domain/Prospect';
import { InfrastructureError } from '../../../shared/domain/exception';

// Infrastructure
import { ProspectEntity } from './entities/Prospect.entity';

@Injectable()
export class ProspectRepositoryAzure extends ProspectRepository {
  constructor(
    @InjectRepository(ProspectEntity)
    private readonly prospectRepository: Repository<ProspectEntity>,
  ) {
    super();
  }
  async getAllBySubstitutionId(substitutionId: string): Promise<Prospect[]> {
    try {
      const entities = await this.prospectRepository.find({
        where: {
          substitutionId: substitutionId,
        },
      });

      if (!entities) {
        throw new InfrastructureError('Not prospect', HttpStatus.NOT_FOUND);
      }

      return this.toDomain(entities);
    } catch (error) {
      if (error instanceof InfrastructureError) {
        throw error;
      }
      throw new InfrastructureError(
        `[SubstitutionId:${substitutionId}] Could not get information from the database`,
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  private toDomain(entities: ProspectEntity[]): Prospect[] {
    return entities.map((entity) => {
      return {
        id: entity.id,
        description: entity.description,
        sku: entity.sku,
        extraPaid: entity.extraPaid,
        subsidy: entity.subsidy,
        substitutionId: entity.substitutionId,
      };
    });
  }
}
