import { Injectable } from '@nestjs/common';

// Domain
import { EventHandler } from '../../domain/EventHandler';

@Injectable()
export class SubstitutionEventHandler implements EventHandler {
  async execute(data: any): Promise<void> {
    console.log('Handling Substitution Event');
  }
}
