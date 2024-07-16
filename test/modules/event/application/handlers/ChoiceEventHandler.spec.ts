import { Test } from '@nestjs/testing';
import { EventEmitter2 } from '@nestjs/event-emitter';

// Domain
import { EventBody } from '../../../../../src/modules/event/domain/EventBody';

// Application
import { ChoiceEventHandler } from '../../../../../src/modules/event/application/handlers/ChoiceEventHandler';

// Infrastructure
import { UpdateChatByChoiceDto } from '../../../../../src/modules/chat/infrastructure/http/dto/updateChatByChoice.dto';

describe('ChoiceEventHandler', () => {
  let choiceEventHandler: ChoiceEventHandler;
  let eventEmitter: EventEmitter2;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ChoiceEventHandler,
        {
          provide: EventEmitter2,
          useFactory: () => ({
            emit: jest.fn(),
          }),
        },
      ],
    }).compile();
    choiceEventHandler = module.get<ChoiceEventHandler>(ChoiceEventHandler);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  it('should be defined', () => {
    expect(choiceEventHandler).toBeDefined();
  });

  it('should call the method correctly and send the message for the use case', async () => {
    const shippingGroupId = 'shippingGroupId';
    const eventBody = new EventBody({
      shippingGroupId,
      event: 'event',
      payload: 'CHOICE_FOR_ME',
    });
    const expectedUpdateChat = new UpdateChatByChoiceDto();
    expectedUpdateChat.shippingGroupId = shippingGroupId;
    expectedUpdateChat.choice = 'CHOICE_FOR_ME';

    const spyEventEmitter = jest
      .spyOn(eventEmitter, 'emit')
      .mockImplementation(() => true);

    await choiceEventHandler.execute(eventBody);
    expect(spyEventEmitter).toHaveBeenCalledWith(
      'chat.updatedPreference',
      expectedUpdateChat,
    );
  });
});
