import { HttpStatus, Injectable } from '@nestjs/common';
import { createSign } from 'crypto';

// Domain
import { InfrastructureError } from '../../../domain/exception';

// Config
import { IConfigAPIWithSR } from '../../../../config/ConfigInterface';

@Injectable()
export class GenerateWithSR {
  async getHeaders(configuration: IConfigAPIWithSR): Promise<any> {
    try {
      const authData = this.getAuthData({
        wmConsumerId: configuration.consumerId,
        privateKey: configuration.privateKey,
        keyVersion: configuration.keyVersion,
      });

      const headers = {
        'Content-Type': 'application/json',
      };

      headers['WM_SVC.NAME'] = configuration.name;
      headers['WM_SVC.ENV'] = configuration.env;
      headers['WM_CONSUMER.ID'] = configuration.consumerId;
      headers['WM_CONSUMER.INTIMESTAMP'] = authData.timestamp;
      headers['WM_SEC.AUTH_SIGNATURE'] = authData.signature;

      return headers;
    } catch (error) {
      throw new InfrastructureError(
        'Could not sign the headers to make requests',
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
  }

  private getAuthData({ wmConsumerId, privateKey, keyVersion }) {
    const timestamp = new Date().getTime();

    if (!privateKey) {
      return {
        signature: 0,
        timestamp: 0,
      };
    }

    const signature = this.getSignature(
      timestamp,
      wmConsumerId,
      privateKey,
      keyVersion,
    );

    return {
      signature,
      timestamp,
    };
  }

  private getSignature(
    timestamp: number,
    wmConsumerId: string,
    privateKey: string,
    keyVersion: string,
  ): string {
    const data = `${wmConsumerId}\n${timestamp}\n${keyVersion}\n`;

    return createSign('RSA-SHA256')
      .update(data)
      .sign(privateKey.replace(/\\n/g, '\n'), 'base64');
  }
}
