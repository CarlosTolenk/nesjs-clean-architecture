import { Test, TestingModule } from '@nestjs/testing';

// Domain
import { ILogger } from '../../../../../src/modules/shared/domain/Logger';

// Application
import { ApplyEventHandler } from '../../../../../src/modules/event/application/useCases/ApplyEventHandler';

// Infrastructure
import {
  EventPayload,
  EventRequestDto,
} from '../../../../../src/modules/event/infrastructure/http/dto/eventRequestDto';
import { EventController } from '../../../../../src/modules/event/infrastructure/http/event.controller';

describe('EventController', () => {
  let controller: EventController;
  let useCase: ApplyEventHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventController],
      providers: [
        { provide: ApplyEventHandler, useValue: { execute: jest.fn() } },
        { provide: ILogger, useValue: { error: jest.fn() } },
      ],
    }).compile();

    controller = module.get<EventController>(EventController);
    useCase = module.get<ApplyEventHandler>(ApplyEventHandler);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should process event correctly', async () => {
    const body = new EventRequestDto();
    body.event = 'testEvent';
    body.button_response = { payload: '' };
    const eventPayload = new EventPayload(body);

    await controller.applyHandlerEvent(body);

    expect(useCase.execute).toHaveBeenCalledWith(eventPayload);
  });

  it('should handle error correctly', async () => {
    const body = new EventRequestDto();
    body.event = 'testEvent';
    body.button_response = { payload: '' };
    const error = new Error('testError');

    (useCase.execute as jest.Mock).mockRejectedValueOnce(error);

    try {
      await controller.applyHandlerEvent(body);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});
