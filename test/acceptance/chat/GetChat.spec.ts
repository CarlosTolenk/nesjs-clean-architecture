import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Modules
import { AppModule } from '../../../src/app.module';

// Load Configuration
import '../../../src/utils/initial-values';

// Infrastructure
import { HttpExceptionFilter } from '../../../src/modules/shared/infrastructure/http/filter/HttpExceptionFilter';
import { ChatEntity } from '../../../src/modules/chat/infrastructure/persistence/entities/Chat.entity';

// Mocks
import { FakeChatBuilder } from '../../__mocks__/builders/FakeChatBuilder';

describe('GetChat (functional)', () => {
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

  it('should return a 400 http status when shippingGroup empty', async () => {
    const searchShippingGroup = {};

    const response = await request(app.getHttpServer())
      .get('/chat')
      .send(searchShippingGroup);

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
          'shippingGroupId must be a string',
          'shippingGroupId should not be empty',
        ],
        statusCode: 400,
      },
      status: 400,
    });
  });

  it('should return a 404 http status when the chat does not exist', async () => {
    const shippingGroupId = 'no-exist';

    const response = await request(app.getHttpServer())
      .get(`/chat?shippingGroupId=${shippingGroupId}`)
      .send();

    expect(response.statusCode).toEqual(HttpStatus.NOT_FOUND);
    expect(response.body).toBeDefined();
  });

  it('should return a 200 http status when the chat exist', async () => {
    const shippingGroupId = '91459756665';
    const chatEntity = new FakeChatBuilder()
      .withShippingGroupId(shippingGroupId)
      .build();
    await chatEntityRepository.save(chatEntity);

    const response = await request(app.getHttpServer())
      .get(`/chat?shippingGroupId=${shippingGroupId}`)
      .send();

    expect(response.statusCode).toEqual(HttpStatus.OK);
    expect(response.body).toEqual({
      agreeExtraPaid: false,
      choice: 'UNANSWERED',
      customerPhone: '56952158950',
      id: expect.any(String),
      sendingDate: expect.any(String),
      shippingGroupId: shippingGroupId,
      customerId: 'customerId',
    });
  });
});
