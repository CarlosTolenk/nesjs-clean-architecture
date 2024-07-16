import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AxiosResponse } from 'axios';
import { LoggerWinston } from '../logger/loggerWinston';

@Injectable()
export class OutgoingRequestTimingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const isOutgoingRequest = this.isOutgoingRequest(request);
    const loggerWinston = new LoggerWinston();

    if (isOutgoingRequest) {
      const startTime = Date.now();

      return next.handle().pipe(
        tap((response: AxiosResponse) => {
          const endTime = Date.now();
          const elapsedTime = endTime - startTime;
          loggerWinston.info(
            `[Outgoing] request to ${response.config.url} took`,
            { elapsedTime },
          );
        }),
      );
    }
    return next.handle();
  }

  private isOutgoingRequest(request: Request): boolean {
    return !request.url.startsWith('/');
  }
}
