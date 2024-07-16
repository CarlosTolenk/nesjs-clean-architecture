import { ApiTags, ApiHeaders } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { serviceRegistryHeaders } from '../../../../assets/serviceRegistryHeadersObject.json';

// Domain
import { ILogger } from '../../../shared/domain/Logger';

// Application
import { GetChatWithSubstitutions } from '../../application/useCases/GetChatWithSubstitutions';
import { GetChat } from '../../application/useCases/GetChat';
import { SendInitialMessage } from '../../application/useCases/SendInitialMessage';
import { SendSubstitutionMessage } from '../../application/useCases/SendSubstitutionMessage';
import { SendFinishedMessage } from '../../application/useCases/SendFinishedMessage';

// Infrastructure
import { SearchShippingGroupIdDto } from './dto/searchShippingGroupId.dto';
import { ResponseChatDetailDto } from './dto/responseChatDetailDto';
import { ResponseChatWithSubstitutionDto } from './dto/responseChatWithSubstitutionDto';
import { SendInitialMessageDto } from './dto/sendInitialMessage.dto';
import { SendSubstitutionMessageDto } from './dto/sendSubstitutionMessage.dto';
import { SendFinishedMessageDto } from './dto/sendFinishedMessageDto';
import { ResponseSendMessageDto } from './dto/responseSendMessage.dto';

@ApiTags('chat')
@ApiHeaders(serviceRegistryHeaders)
@Controller('chat')
export class ChatController {
  constructor(
    private readonly logger: ILogger,
    private readonly useCaseWithSubstitutions: GetChatWithSubstitutions,
    private readonly useCases: GetChat,
    private readonly useCasesSendInitial: SendInitialMessage,
    private readonly useCasesSendSubstitution: SendSubstitutionMessage,
    private readonly useCasesSendFinished: SendFinishedMessage,
  ) {}

  @Get('/withSubstitution')
  async getWithSubstitutionByShippingGroupId(
    @Query() params: SearchShippingGroupIdDto,
  ): Promise<ResponseChatWithSubstitutionDto> {
    try {
      return await this.useCaseWithSubstitutions.execute(params);
    } catch (error) {
      this.logger.error('Error to hit getWithSubstitutionByShippingGroupId', {
        ...error,
      });
      throw error;
    }
  }

  @Get('')
  async getByShippingGroupId(
    @Query() params: SearchShippingGroupIdDto,
  ): Promise<ResponseChatDetailDto> {
    try {
      return await this.useCases.execute(params);
    } catch (error) {
      this.logger.error('Error to hit getByShippingGroupId', { ...error });
      throw error;
    }
  }

  @Post('/initialMessage')
  @HttpCode(HttpStatus.OK)
  async postInitialMessage(
    @Body() body: SendInitialMessageDto,
  ): Promise<ResponseSendMessageDto> {
    try {
      return await this.useCasesSendInitial.execute(body);
    } catch (error) {
      this.logger.error('Error to hit postInitialMessage', { ...error });
      throw error;
    }
  }

  @Post('/substitutionMessage')
  @HttpCode(HttpStatus.OK)
  async postSubstitutionMessage(
    @Body() body: SendSubstitutionMessageDto,
  ): Promise<ResponseSendMessageDto> {
    try {
      return await this.useCasesSendSubstitution.execute(body);
    } catch (error) {
      this.logger.error('Error to hit postSubstitutionMessage', { ...error });
      throw error;
    }
  }

  @Post('/finishedMessage')
  @HttpCode(HttpStatus.OK)
  async postFinishedMessage(
    @Body() body: SendFinishedMessageDto,
  ): Promise<ResponseSendMessageDto> {
    try {
      return await this.useCasesSendFinished.execute(body);
    } catch (error) {
      this.logger.error('Error to hit postFinishedMessage', { ...error });
      throw error;
    }
  }
}
