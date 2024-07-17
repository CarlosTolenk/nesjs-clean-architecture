import { HttpStatus } from '@nestjs/common';
import { Test } from '@nestjs/testing';

// Domain
import { EventTypes } from '../../../../../src/modules/shared/domain/EventTypes';
import { ApplicationError } from '../../../../../src/modules/shared/domain/exception';
import { ILogger } from '../../../../../src/modules/shared/domain/Logger';

// Application
import { FactoryEventHandler } from '../../../../../src/modules/webhook/application/services/FactoryEventHandler';
import { ChoiceEventHandler } from '../../../../../src/modules/webhook/application/handlers/ChoiceEventHandler';
import { SubstitutionEventHandler } from '../../../../../src/modules/webhook/application/handlers/SubstitutionEventHandler';
import { EventEmitter2 } from '@nestjs/event-emitter';

describe('FactoryEventHandler', () => {
  let factoryEventHandler: FactoryEventHandler;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        FactoryEventHandler,
        ChoiceEventHandler,
        {
          provide: ILogger,
          useFactory: () => ({
            info: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn(),
          }),
        },
        {
          provide: EventEmitter2,
          useFactory: () => ({
            emitAsync: jest.fn(),
          }),
        },
      ],
    }).compile();
    factoryEventHandler = module.get<FactoryEventHandler>(FactoryEventHandler);
  });

  it('should create a ChoiceEventHandler for WSP_PICKING_SUBSTITUTION_PREFERENCES_V1', async () => {
    const eventType = EventTypes.WSP_PICKING_SUBSTITUTION_PREFERENCES_V1;
    const eventHandler = factoryEventHandler.create(eventType);
    expect(eventHandler).toBeInstanceOf(ChoiceEventHandler);
  });

  it('should create a SubstitutionEventHandler for WSP_PICKING_SUBSTITUTION_PROSPECT_APPROVAL', async () => {
    const eventType = EventTypes.WSP_PICKING_SUBSTITUTION_PROSPECT_APPROVAL;
    const eventHandler = factoryEventHandler.create(eventType);
    expect(eventHandler).toBeInstanceOf(SubstitutionEventHandler);
  });

  it('should throw an error if the event type is not valid', async () => {
    const eventType = 'INVALID_EVENT_TYPE';
    expect(() => factoryEventHandler.create(eventType)).toThrowError(
      new ApplicationError(
        `The event:${eventType} is not valid`,
        HttpStatus.BAD_REQUEST,
      ),
    );
  });
});
