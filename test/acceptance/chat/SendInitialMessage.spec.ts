import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

// Load Configuration
import '../../../src/utils/initial-values';

// Modules
import { AppModule } from '../../../src/app.module';

// Infrastructure
import { ChatEntity } from '../../../src/modules/chat/infrastructure/persistence/entities/Chat.entity';
import { HttpExceptionFilter } from '../../../src/modules/shared/infrastructure/http/filter/HttpExceptionFilter';
import { SendInitialMessageDto } from '../../../src/modules/chat/infrastructure/http/dto/sendInitialMessage.dto';

// Mocks
import { FakeChatBuilder } from '../../__mocks__/builders/FakeChatBuilder';
import { SendMessageMockServer } from '../../__mocks__/interceptors/Hermes/SendMessage';

describe('SendInitialMessage (functional)', () => {
  let app: INestApplication;
  let chatEntityRepository: Repository<ChatEntity>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
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

  it('should return 400 http status when payload empty', async () => {
    const payload = {};

    const response = await request(app.getHttpServer())
      .post('/chat/initialMessage')
      .send(payload);

    expect(response.statusCode).toEqual(HttpStatus.BAD_REQUEST);
    expect(response.body).toBeDefined();
    expect(response.body).toEqual({
      details: {
        message: 'Bad Request Exception',
        name: 'BadRequestException',
        options: {},
        response: {
          error: 'Bad Request',
          message: [
            'shippingGroupId must be a string',
            'firstName must be a string',
            'cellphone must be a string',
            'customerId must be a string',
          ],
          statusCode: 400,
        },
        status: 400,
      },
      path: '/chat/initialMessage',
      statusCode: 400,
      timestamp: expect.any(String),
    });
  });

  it('should return 200 http when chat exist because the conversation exists but it does not send the message to WhatsApp ', async () => {
    const shippingGroupId = 'shippingGroupId';
    const payload: SendInitialMessageDto = {
      shippingGroupId,
      firstName: '',
      cellphone: '',
      customerId: '',
    };
    const chatEntity = new FakeChatBuilder()
      .withShippingGroupId(shippingGroupId)
      .build();
    await chatEntityRepository.save(chatEntity);

    const response = await request(app.getHttpServer())
      .post('/chat/initialMessage')
      .send(payload);

    expect(response.statusCode).toEqual(HttpStatus.OK);
    expect(response.body).toBeDefined();
    expect(response.body).toEqual({
      details: {
        message:
          '[SG:shippingGroupId] The initial message has already been sent to the client previously',
        name: 'ApplicationError',
        response:
          '[SG:shippingGroupId] The initial message has already been sent to the client previously',
        status: 200,
      },
      path: '/chat/initialMessage',
      statusCode: 200,
      timestamp: expect.any(String),
    });
  });
  it('should return 409 http when chat exist because the conversation exists and dont send message to WhatsApp ', async () => {
    SendMessageMockServer.fail();
    const shippingGroupId = 'shippingGroupId';
    const payload: SendInitialMessageDto = {
      shippingGroupId,
      firstName: 'John',
      cellphone: '56952158950',
      customerId: 'customerId',
    };

    const responseSendMessage = await request(app.getHttpServer())
      .post('/chat/initialMessage')
      .send(payload);

    expect(responseSendMessage.statusCode).toEqual(HttpStatus.CONFLICT);
    expect(responseSendMessage.body).toBeDefined();

    const responseGetChat = await request(app.getHttpServer())
      .get(`/chat?shippingGroupId=${shippingGroupId}`)
      .send();

    expect(responseGetChat.statusCode).toEqual(HttpStatus.NOT_FOUND);
    expect(responseGetChat.body).toBeDefined();
  });
  it('should return 200 http when chat exist because the conversation exists and send message to WhatsApp ', async () => {
    SendMessageMockServer.success();
    const shippingGroupId = 'shippingGroupId';
    const payload: SendInitialMessageDto = {
      shippingGroupId,
      firstName: 'John',
      cellphone: '56952158950',
      customerId: 'customerId',
    };

    const responseSendMessage = await request(app.getHttpServer())
      .post('/chat/initialMessage')
      .send(payload);

    expect(responseSendMessage.statusCode).toEqual(HttpStatus.OK);
    expect(responseSendMessage.body).toBeDefined();
    expect(responseSendMessage.body).toEqual({
      message: 'Sent',
      status: 'OK',
    });

    const responseGetChat = await request(app.getHttpServer())
      .get(`/chat?shippingGroupId=${shippingGroupId}`)
      .send();

    expect(responseGetChat.statusCode).toEqual(HttpStatus.OK);
    expect(responseGetChat.body).toBeDefined();
  });
});
