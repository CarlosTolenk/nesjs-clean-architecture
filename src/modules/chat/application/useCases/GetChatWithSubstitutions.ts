import { HttpStatus, Injectable } from '@nestjs/common';

// Domain
import { IUseCases } from '../../../shared/domain/UseCases';
import { ChatRepository } from '../../domain/ChatRepository';
import { ProspectRepository } from '../../domain/ProspectRepository';
import { SubstitutionRepository } from '../../domain/SubstitutionRepository';
import { Prospect } from '../../domain/Prospect';
import { Substitution } from '../../domain/Substitution';
import { ApplicationError } from '../../../shared/domain/exception';
import { Chat } from '../../domain/Chat';

// Infrastructure
import { SearchShippingGroupIdDto } from '../../infrastructure/http/dto/searchShippingGroupId.dto';
import { ResponseChatWithSubstitutionDto } from '../../infrastructure/http/dto/responseChatWithSubstitutionDto';
import LogMethod from '../../../shared/infrastructure/decorators/LogMethod';

@Injectable()
export class GetChatWithSubstitutions
  implements
    IUseCases<SearchShippingGroupIdDto, ResponseChatWithSubstitutionDto>
{
  constructor(
    private readonly chatRepository: ChatRepository,
    private readonly prospectRepository: ProspectRepository,
    private readonly substitutionRepository: SubstitutionRepository,
  ) {}

  @LogMethod()
  async execute({
    shippingGroupId,
  }: SearchShippingGroupIdDto): Promise<ResponseChatWithSubstitutionDto> {
    const chat = await this.chatRepository.getByShippingGroup(shippingGroupId);

    this.ensureChatExist(chat, shippingGroupId);

    const substitutions = await this.substitutionRepository.getAllByChatId(
      chat.id,
    );

    if (!substitutions || substitutions.length === 0) {
      return {
        chat: chat.toPrimitives(),
        substitution: null,
      };
    }

    const substitutionWithProspect =
      await this.getProspectsForSubstitutions(substitutions);

    const substitutionByGroupBySku = this.groupBySku(substitutionWithProspect);

    return {
      chat: chat.toPrimitives(),
      substitution: substitutionByGroupBySku,
    };
  }

  private ensureChatExist(chat: Chat, shippingGroupId: string): void {
    if (!chat) {
      throw new ApplicationError(
        `There is no chat with that shippingGroupId ${shippingGroupId}`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  private groupBySku(
    metadata: {
      prospect: Prospect[];
      id: string;
      messageId: string;
      agree: string;
      descriptionOriginal: string;
      skuOriginal: string;
      chatId: string;
    }[],
  ) {
    return metadata.reduce((accumulator, current) => {
      const sku = current.skuOriginal;

      return { ...accumulator, [sku]: current };
    }, {});
  }
  @LogMethod()
  private async getProspectsForSubstitutions(substitutions: Substitution[]) {
    const substitutionInPromise = substitutions.map(async (substitution) => {
      const prospect = await this.prospectRepository.getAllBySubstitutionId(
        substitution.id,
      );

      return {
        ...substitution.toPrimitives(),
        prospect: prospect,
      };
    });

    return Promise.all(substitutionInPromise);
  }
}
