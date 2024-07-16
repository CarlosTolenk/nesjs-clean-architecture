import { HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

// Domain
import { SendMessageRepository } from '../../domain/SendMessageRepository';
import { BodyMessage } from '../../domain/templates/BodyMessage';
import { ILogger } from '../../../shared/domain/Logger';
import { PayloadMessage } from '../../domain/templates/payloads/PayloadMessage';
import { InfrastructureError } from '../../../shared/domain/exception';

// Infrastructure
import { GenerateWithSR } from '../../../shared/infrastructure/http/headers/GenerateWithSR';

// Config
import { ConfigEnvService } from '../../../config/ConfigEnvService';
import LogOutgoing from '../../../shared/infrastructure/decorators/LogOutgoing';

interface RequestPayload {
  channel: string;
  customer: {
    cellphone: string;
    first_name: string;
  };
  event: string;
  key: string;
  key_complement: string;
  payload: object;
}

@Injectable()
export class SendMessageRepositoryApi extends SendMessageRepository {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigEnvService,
    private readonly generateWithSR: GenerateWithSR,
    private readonly logger: ILogger,
  ) {
    super();
  }

  async send<T extends BodyMessage<PayloadMessage<unknown>>>(
    bodyMessage: T,
  ): Promise<void> {
    try {
      const body = this.mapToRequest(bodyMessage);
      await this.makeRequest(body);
      return Promise.resolve(undefined);
    } catch (error) {
      throw error;
    }
  }

  private mapToRequest<T extends BodyMessage<PayloadMessage<unknown>>>(
    bodyMessage: T,
  ): RequestPayload {
    const body = bodyMessage.messagePlain();
    return {
      channel: body.channel,
      customer: {
        cellphone: body.customer.cellphone,
        first_name: body.customer.firstName,
      },
      event: body.event,
      key: body.shippingGroupId,
      key_complement: body.sendingDate,
      payload: body.payload,
    };
  }

  @LogOutgoing('HermesApi Chat')
  private async makeRequest(bodyMessage: RequestPayload): Promise<any> {
    try {
      const configurationHermes = this.configService.getConfig().apis.hermes;
      const headers = await this.generateWithSR.getHeaders(configurationHermes);

      const result = await firstValueFrom(
        this.httpService.post<any>(
          `${configurationHermes.endpoint}/v1/notifications`,
          { ...bodyMessage },
          {
            headers: headers,
          },
        ),
      );

      this.logger.info(
        `[SG:${bodyMessage.key}] Response Hermes Send Message API data-raw`,
        {
          ...result.data,
        },
      );

      return result.data.data;
    } catch (error) {
      this.handlerError(error);
    }
  }

  private handlerError(error: Error): Error {
    //  TODO handle all errors
    if (error instanceof InfrastructureError) {
      throw error;
    }

    throw new InfrastructureError(error.message, HttpStatus.CONFLICT);
  }
}
