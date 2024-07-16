import { HttpException } from '@nestjs/common';

export class DomainError extends HttpException {
  constructor(message: string, statusCode: number) {
    super(message, statusCode);
  }
}
