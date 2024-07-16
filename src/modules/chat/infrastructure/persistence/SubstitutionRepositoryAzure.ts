import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Domain
import { Substitution } from '../../domain/Substitution';
import { SubstitutionRepository } from '../../domain/SubstitutionRepository';
import { InfrastructureError } from '../../../shared/domain/exception';

// Infrastructure
import { SubstitutionEntity } from './entities/Substitution.entity';

@Injectable()
export class SubstitutionRepositoryAzure extends SubstitutionRepository {
  constructor(
    @InjectRepository(SubstitutionEntity)
    private readonly substitutionRepository: Repository<SubstitutionEntity>,
  ) {
    super();
  }
  async getAllByChatId(chatId: string): Promise<Substitution[]> {
    try {
      const entities = await this.substitutionRepository.find({
        where: {
          chatId: chatId,
        },
      });

      if (!entities) {
        throw new InfrastructureError('Not substitution', HttpStatus.NOT_FOUND);
      }

      return entities.map((entity) => this.toDomain(entity));
    } catch (error) {
      if (error instanceof InfrastructureError) {
        throw error;
      }
      throw new InfrastructureError(
        `[ChatId:${chatId}] Could not get information from the database`,
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  private toDomain(entity: SubstitutionEntity): Substitution {
    return new Substitution({ ...entity });
  }
}
