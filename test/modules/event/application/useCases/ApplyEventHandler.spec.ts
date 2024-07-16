import { Test } from '@nestjs/testing';

// Modules
import { SharedModule } from '../../../../../src/modules/shared/shared.module';

// Domain
import { ApplicationError } from '../../../../../src/modules/shared/domain/exception';

// Application
import { ApplyEventHandler } from '../../../../../src/modules/webhook/application/useCases/ApplyEventHandler';
import { FactoryEventHandler } from '../../../../../src/modules/webhook/application/services/FactoryEventHandler';
import { ChoiceEventHandler } from '../../../../../src/modules/webhook/application/handlers/ChoiceEventHandler';

// Infrastructure
import { EventResultDto } from '../../../../../src/modules/webhook/infrastructure/http/dto/eventResult.dto';
import { EventPayload } from '../../../../../src/modules/webhook/infrastructure/http/dto/eventRequestDto';
import { EventEmitter2 } from '@nestjs/event-emitter';

describe('ApplyEventHandler', () => {
  let applyEventHandler: ApplyEventHandler;
  let factoryEventHandler: FactoryEventHandler;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [SharedModule],
      providers: [
        ApplyEventHandler,
        FactoryEventHandler,
        ChoiceEventHandler,
        {
          provide: EventEmitter2,
          useFactory: () => ({
            emit: jest.fn(),
          }),
        },
      ],
    }).compile();

    applyEventHandler = module.get<ApplyEventHandler>(ApplyEventHandler);
    factoryEventHandler = module.get<FactoryEventHandler>(FactoryEventHandler);
  });

  it('should defined', () => {
    expect(applyEventHandler).toBeDefined();
    expect(factoryEventHandler).toBeDefined();
  });

  it('should return a controller error when it does not have that type of event registered', async () => {
    const eventPayload: EventPayload = {
      event: 'testType',
      shippingGroupId: '',
      payload: '',
    };

    await expect(applyEventHandler.execute(eventPayload)).rejects.toThrow(
      ApplicationError,
    );
  });

  it('should return a positive state when the invoked event is registered with the name of CHOICE_PREFERENCES', async () => {
    const eventPayload: EventPayload = {
      event: 'WSP_PICKING_SUBSTITUTION_PREFERENCES_V1',
      shippingGroupId: '',
      payload: '',
    };

    const result = await applyEventHandler.execute(eventPayload);

    expect(result).toEqual(EventResultDto.OK());
  });

  it('should return a positive state when the invoked event is registered with the name of SUBSTITUTION_PREFERENCES', async () => {
    const eventPayload: EventPayload = {
      event: 'WSP_PICKING_SUBSTITUTION_PROSPECT_APPROVAL',
      shippingGroupId: '',
      payload: '',
    };

    const result = await applyEventHandler.execute(eventPayload);

    expect(result).toEqual(EventResultDto.OK());
  });
});
