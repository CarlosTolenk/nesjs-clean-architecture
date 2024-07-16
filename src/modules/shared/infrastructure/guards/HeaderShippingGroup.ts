import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { InfrastructureError } from '../../domain/exception';
import { ILogger } from '../../domain/Logger';

@Injectable()
export class HeaderShippingGroup implements CanActivate {
  constructor(private readonly logger: ILogger) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    this.logger.info(
      `Incoming request for shippingGroup [${request.headers['shipping-group']}]`,
      { ...request },
    );
    const shippingGroupId = request.headers['shipping-group'];

    if (!shippingGroupId) {
      throw new InfrastructureError(
        'You must indicate the shipping-group in the headers to be able to process your request',
        HttpStatus.BAD_REQUEST,
      );
    }
    return true;
  }
}
