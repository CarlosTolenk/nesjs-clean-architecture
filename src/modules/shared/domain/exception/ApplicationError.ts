import { DomainError } from './DomainError';

export class ApplicationError extends DomainError {
  constructor(message: string, statusCode: number) {
    super(message, statusCode);
  }
}
