import { HttpStatus, Injectable } from '@nestjs/common';

// Domain
import { IUseCases } from '../../../shared/domain/UseCases';
import { ChatRepository } from '../../domain/ChatRepository';
import { Chat } from '../../domain/Chat';
import { ApplicationError } from '../../../shared/domain/exception';

// Infrastructure
import { SearchShippingGroupIdDto } from '../../infrastructure/http/dto/searchShippingGroupId.dto';
import { ResponseChatDetailDto } from '../../infrastructure/http/dto/responseChatDetailDto';
import LogMethod from '../../../shared/infrastructure/decorators/LogMethod';

@Injectable()
export class GetChat
  implements IUseCases<SearchShippingGroupIdDto, ResponseChatDetailDto>
{
  constructor(private readonly chatRepository: ChatRepository) {}

  @LogMethod()
  async execute({
    shippingGroupId,
  }: SearchShippingGroupIdDto): Promise<ResponseChatDetailDto> {
    const chat = await this.chatRepository.getByShippingGroup(shippingGroupId);

    this.ensureChatExist(chat, shippingGroupId);

    return {
      ...chat.toPrimitives(),
    };
  }

  private ensureChatExist(chat: Chat, shippingGroupId: string): void {
    if (!chat) {
      throw new ApplicationError(
        `[SG:${shippingGroupId}] There is no chat for that shipping group`,
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
