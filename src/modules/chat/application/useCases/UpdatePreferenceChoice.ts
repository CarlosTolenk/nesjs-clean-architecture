import { HttpStatus, Injectable } from '@nestjs/common';

// Domain
import { Chat, ChoiceAvailableType } from '../../domain/Chat';
import { IUseCases } from '../../../shared/domain/UseCases';
import { ChatRepository } from '../../domain/ChatRepository';
import { ApplicationError } from '../../../shared/domain/exception';

// Infrastructure
import { ResponseChatDetailDto } from '../../infrastructure/http/dto/responseChatDetailDto';
import { UpdateChatByChoiceDto } from '../../infrastructure/http/dto/updateChatByChoice.dto';

@Injectable()
export class UpdatePreferenceChoice
  implements IUseCases<UpdateChatByChoiceDto, ResponseChatDetailDto>
{
  constructor(private readonly chatRepository: ChatRepository) {}
  async execute({
    shippingGroupId,
    choice,
  }: UpdateChatByChoiceDto): Promise<ResponseChatDetailDto> {
    try {
      const chat =
        await this.chatRepository.getByShippingGroup(shippingGroupId);
      this.ensureThatChatHasAResponse(chat, shippingGroupId);
      const chatUpdated = await this.updateChoicePreference(chat, choice);
      return chatUpdated.toPrimitives();
    } catch (error) {
      throw error;
    }
  }

  private ensureThatChatHasAResponse(
    chat: Chat,
    shippingGroupId: string,
  ): void {
    if (!chat) {
      throw new ApplicationError(
        `[SG:${shippingGroupId}] This chat not exist`,
        HttpStatus.OK,
      );
    }

    if (!chat.hasAnInitialChat()) {
      throw new ApplicationError(
        `[SG:${chat.shippingGroupId}] This chat already has a response and cannot be updated`,
        HttpStatus.OK,
      );
    }
  }

  private async updateChoicePreference(
    chat: Chat,
    choice: string,
  ): Promise<Chat> {
    const preferenceCustomer = this.mapToDomainChoice(choice);
    const chatUpdated = new Chat({
      id: chat.id,
      shippingGroupId: chat.shippingGroupId,
      choice: preferenceCustomer,
      customerPhone: chat.customerPhone,
      customerId: chat.customerId,
      sendingDate: chat.sendingDate,
      agreeExtraPaid: chat.agreeExtraPaid,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
    });
    await this.chatRepository.update(chatUpdated);
    return chatUpdated;
  }

  private mapToDomainChoice(choice: string): ChoiceAvailableType {
    return ChoiceAvailableType[choice] ?? ChoiceAvailableType.UNANSWERED;
  }
}
