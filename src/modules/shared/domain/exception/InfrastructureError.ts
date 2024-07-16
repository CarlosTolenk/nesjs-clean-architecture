import { DomainError } from './DomainError';

export class InfrastructureError extends DomainError {
  constructor(message: string, statusCode: number) {
    super(message, statusCode);
  }
}
