import { HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';

// Domain
import { MakeCallRepository } from '../../domain/MakeCallRepository';
import { PayloadMakeCall } from '../../domain/valueObject/PayloadMakeCall';
import { InfrastructureError } from '../../../shared/domain/exception';
import { ILogger } from '../../../shared/domain/Logger';

//Infrastructure
import { GenerateWithSR } from '../../../shared/infrastructure/http/headers/GenerateWithSR';

// Config
import { ConfigEnvService } from '../../../config/ConfigEnvService';
import LogOutgoing from '../../../shared/infrastructure/decorators/LogOutgoing';

interface ResponseHermes {
  data: {
    notification: {
      id: string;
    };
  };
}

interface RequestPayload {
  channel: string;
  event: string;
  key: string;
  key_complement: string;
  customer: {
    cellphone: string;
  };
  from: {
    cellphone: string;
  };
}

@Injectable()
export class MakeCallRepositoryApi extends MakeCallRepository {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigEnvService,
    private readonly generateWithSR: GenerateWithSR,
    private readonly logger: ILogger,
  ) {
    super();
  }

  async execute(payloadMakeCall: PayloadMakeCall): Promise<string> {
    try {
      const payload = this.mapToRequest(payloadMakeCall);
      const notificationId = await this.makeRequest(payload);
      return Promise.resolve(notificationId);
    } catch (error) {
      throw error;
    }
  }

  private mapToRequest(payloadMakeCall: PayloadMakeCall): RequestPayload {
    const payloadPlain = payloadMakeCall.toPrimitives();
    return {
      channel: payloadPlain.channel,
      event: payloadPlain.event,
      key: payloadPlain.shippingGroupId,
      key_complement: payloadPlain.sendingDate,
      customer: {
        cellphone: payloadPlain.customer.cellphone,
      },
      from: {
        cellphone: payloadPlain.from.cellphone,
      },
    };
  }

  @LogOutgoing('HermesApi Call')
  private async makeRequest(bodyMessage: RequestPayload): Promise<string> {
    try {
      const configurationHermes = this.configService.getConfig().apis.hermes;
      const headers = await this.generateWithSR.getHeaders(configurationHermes);

      const result: AxiosResponse<ResponseHermes> = await firstValueFrom(
        this.httpService.post<any>(
          `${configurationHermes.endpoint}/v1/calls`,
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

      return result.data.data.notification.id;
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
