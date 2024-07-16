import { HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

// Domain
import { ChatRepository } from '../../domain/ChatRepository';
import { Chat, ChoiceAvailableType } from '../../domain/Chat';
import { InfrastructureError } from '../../../shared/domain/exception';
import { ShippingGroupId } from '../../../shared/domain/valueObject/ShippingGroupId';
import { Cellphone } from '../../../shared/domain/valueObject/Cellphone';
import { CustomerId } from '../../../shared/domain/valueObject/CustomerId';

// Infrastructure
import { ChatEntity } from './entities/Chat.entity';
import LogMethod from '../../../shared/infrastructure/decorators/LogMethod';
import * as console from 'console';
import { DomainError } from '../../../shared/domain/exception/DomainError';

@Injectable()
export class ChatRepositoryAzure extends ChatRepository {
  constructor(
    @InjectRepository(ChatEntity)
    private readonly chatRepository: Repository<ChatEntity>,
  ) {
    super();
  }
  @LogMethod()
  async getByShippingGroup(shippingGroupId: string): Promise<Chat | null> {
    try {
      const entity = await this.chatRepository.findOne({
        where: {
          shippingGroupId: shippingGroupId,
        },
      });

      if (!entity) {
        return null;
      }

      return this.toDomain(entity);
    } catch (error) {
      if (error instanceof DomainError) {
        throw new InfrastructureError(
          `[SG:${shippingGroupId}] - problem converting database data to domain model - ${error.message}`,
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }

      throw new InfrastructureError(
        `[SG:${shippingGroupId}] Could not get information from the database`,
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  private toDomain(entity: ChatEntity): Chat {
    return new Chat({
      id: entity.id,
      shippingGroupId: new ShippingGroupId(entity.shippingGroupId),
      choice: entity.choice as ChoiceAvailableType,
      customerPhone: new Cellphone(entity.customerPhone),
      customerId: new CustomerId(entity.customerId),
      sendingDate: entity.date,
      agreeExtraPaid: entity.agreeExtraPaid,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  @LogMethod()
  async save(chat: Chat): Promise<void> {
    try {
      const chatEntity = ChatEntity.create({
        shippingGroupId: chat.shippingGroupId.value,
        customerPhone: chat.customerPhone.value,
        customerId: chat.customerId.value,
        sendingDate: chat.sendingDate,
        choice: chat.choice,
      });

      await this.chatRepository.save(chatEntity);
    } catch (error) {
      throw new InfrastructureError(
        `[SG:${chat.shippingGroupId.value}] Could not save information from the database`,
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  @LogMethod()
  async update(chat: Chat): Promise<void> {
    try {
      const chatEntity = ChatEntity.fromDomain(chat);

      await this.chatRepository.save(chatEntity);
    } catch (error) {
      throw new InfrastructureError(
        `[SG:${chat.shippingGroupId.value}] Could not update information from the database`,
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}
