import { TypeOrmModule } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Repository } from 'typeorm';
import request from 'supertest';

// Load Configuration
import '../../../src/utils/initial-values';

// Modules
import { AppModule } from '../../../src/app.module';

// Domain
import { ChoiceAvailableType } from '../../../src/modules/chat/domain/Chat';

// Infrastructure
import { ChatEntity } from '../../../src/modules/chat/infrastructure/persistence/entities/Chat.entity';
import { HttpExceptionFilter } from '../../../src/modules/shared/infrastructure/http/filter/HttpExceptionFilter';
import { EventRequestDto } from '../../../src/modules/webhook/infrastructure/http/dto/eventRequestDto';

// Mocks
import { FakeChatBuilder } from '../../__mocks__/builders/FakeChatBuilder';

describe('UpdateChoicePreferences', () => {
  let app: INestApplication;
  let chatEntityRepository: Repository<ChatEntity>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TypeOrmModule.forFeature([ChatEntity])],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();

    chatEntityRepository = moduleFixture.get('ChatEntityRepository');
  });

  beforeEach(async () => {
    await chatEntityRepository.query(`DELETE FROM chat;`);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be defined', () => {
    expect(chatEntityRepository).toBeDefined();
  });

  it('should return a 400 http status when event empty', async () => {
    const eventRequest = new EventRequestDto();

    const response = await request(app.getHttpServer())
      .post('/event')
      .send(eventRequest);

    expect(response.statusCode).toEqual(HttpStatus.BAD_REQUEST);
    expect(response.body).toBeDefined();
    expect(response.body.details).toBeDefined();
    expect(response.body.details).toEqual({
      message: 'Bad Request Exception',
      name: 'BadRequestException',
      options: {},
      response: {
        error: 'Bad Request',
        message: [
          'event must be a string',
          'event should not be empty',
          'key must be a string',
          'key should not be empty',
          'key_complement must be a string',
          'key_complement should not be empty',
          'message_id must be a string',
          'message_id should not be empty',
          'parent_message_id must be a string',
          'parent_message_id should not be empty',
          'customer_id must be a string',
          'customer_id should not be empty',
          'received_by_provider_at must be a string',
          'received_by_provider_at should not be empty',
          'registered_by_contactability_at must be a string',
          'registered_by_contactability_at should not be empty',
          'updated_at must be a string',
          'updated_at should not be empty',
          'status must be a string',
          'status should not be empty',
          'button_response must be an object',
        ],
        statusCode: 400,
      },
      status: 400,
    });
  });

  it('should return a 400 http status when event is not valid', async () => {
    const eventRequest = EventRequestDtoFactory(
      'shippingGroupId',
      'CHOICE_FOR_ME',
      'event-not-valid',
    );

    const response = await request(app.getHttpServer())
      .post('/event')
      .send(eventRequest);

    expect(response.statusCode).toEqual(HttpStatus.BAD_REQUEST);
    expect(response.body).toBeDefined();
    expect(response.body.details).toBeDefined();
    expect(response.body.details).toEqual({
      message: 'The event:event-not-valid is not valid',
      name: 'ApplicationError',
      response: 'The event:event-not-valid is not valid',
      status: 400,
    });
  });

  it('should return a 200 http status and return event correct but not updated chat', async () => {
    const shippingGroupId = '91459756665';
    const eventRequest = EventRequestDtoFactory(
      shippingGroupId,
      'CHOICE_FOR_ME',
    );
    const chatEntity = new FakeChatBuilder()
      .withShippingGroupId(shippingGroupId)
      .withChoice(ChoiceAvailableType.CHOICE_FOR_ME)
      .build();
    await chatEntityRepository.save(chatEntity);

    const response = await request(app.getHttpServer())
      .post('/event')
      .send(eventRequest);

    expect(response.statusCode).toEqual(HttpStatus.OK);
    expect(response.body).toBeDefined();
    expect(response.body).toEqual({
      eventType: 'WSP_PICKING_SUBSTITUTION_PREFERENCES_V1',
      message: 'Received',
      status: 'OK',
    });

    const responseGetChat = await request(app.getHttpServer())
      .get(`/chat?shippingGroupId=${shippingGroupId}`)
      .send();

    expect(responseGetChat.statusCode).toEqual(HttpStatus.OK);
    expect(responseGetChat.body).toBeDefined();
    expect(responseGetChat.body).toEqual({
      agreeExtraPaid: false,
      choice: 'CHOICE_FOR_ME',
      customerPhone: '56952158950',
      id: expect.any(String),
      sendingDate: expect.any(String),
      shippingGroupId: '91459756665',
      customerId: 'customerId',
    });
  });

  it('should return a 200 http status and return event correct and updated chat - OPTION CHOICE_FOR_ME', async () => {
    const shippingGroupId = '91459756665';
    const eventRequest = EventRequestDtoFactory(
      shippingGroupId,
      'CHOICE_FOR_ME',
    );
    const chatEntity = new FakeChatBuilder()
      .withShippingGroupId(shippingGroupId)
      .withChoice(ChoiceAvailableType.UNANSWERED)
      .build();
    await chatEntityRepository.save(chatEntity);

    const response = await request(app.getHttpServer())
      .post('/event')
      .send(eventRequest);

    expect(response.statusCode).toEqual(HttpStatus.OK);
    expect(response.body).toBeDefined();
    expect(response.body).toEqual({
      eventType: 'WSP_PICKING_SUBSTITUTION_PREFERENCES_V1',
      message: 'Received',
      status: 'OK',
    });

    const responseGetChat = await request(app.getHttpServer())
      .get(`/chat?shippingGroupId=${shippingGroupId}`)
      .send();

    expect(responseGetChat.statusCode).toEqual(HttpStatus.OK);
    expect(responseGetChat.body).toBeDefined();
    expect(responseGetChat.body).toEqual({
      agreeExtraPaid: false,
      choice: 'CHOICE_FOR_ME',
      customerPhone: '56952158950',
      id: expect.any(String),
      sendingDate: expect.any(String),
      shippingGroupId: '91459756665',
      customerId: 'customerId',
    });
  });

  it('should return a 200 http status and return event correct and updated chat - OPTION REFUND', async () => {
    const shippingGroupId = '91459756665';
    const eventRequest = EventRequestDtoFactory(shippingGroupId, 'REFUND');
    const chatEntity = new FakeChatBuilder()
      .withShippingGroupId(shippingGroupId)
      .withChoice(ChoiceAvailableType.UNANSWERED)
      .build();
    await chatEntityRepository.save(chatEntity);

    const response = await request(app.getHttpServer())
      .post('/event')
      .send(eventRequest);

    expect(response.statusCode).toEqual(HttpStatus.OK);
    expect(response.body).toBeDefined();
    expect(response.body).toEqual({
      eventType: 'WSP_PICKING_SUBSTITUTION_PREFERENCES_V1',
      message: 'Received',
      status: 'OK',
    });

    const responseGetChat = await request(app.getHttpServer())
      .get(`/chat?shippingGroupId=${shippingGroupId}`)
      .send();

    expect(responseGetChat.statusCode).toEqual(HttpStatus.OK);
    expect(responseGetChat.body).toBeDefined();
    expect(responseGetChat.body).toEqual({
      agreeExtraPaid: false,
      choice: 'REFUND',
      customerPhone: '56952158950',
      id: expect.any(String),
      sendingDate: expect.any(String),
      shippingGroupId: '91459756665',
      customerId: 'customerId',
    });
  });
});

const EventRequestDtoFactory = (
  shippingGroupId: string,
  optionPayload: string,
  event: string = 'WSP_PICKING_SUBSTITUTION_PREFERENCES_V1',
): EventRequestDto => {
  const eventRequest = new EventRequestDto();
  eventRequest.event = event;
  eventRequest.key = shippingGroupId;
  eventRequest.key_complement = 'key_complement';
  eventRequest.message_id = 'message_id';
  eventRequest.parent_message_id = 'parent_message_id';
  eventRequest.customer_id = 'customer_id';
  eventRequest.received_by_provider_at = 'received_by_provider_at';
  eventRequest.registered_by_contactability_at =
    'registered_by_contactability_at';
  eventRequest.updated_at = 'updated_at';
  eventRequest.status = 'status';
  eventRequest.button_response = {
    payload: optionPayload,
  };
  return eventRequest;
};
