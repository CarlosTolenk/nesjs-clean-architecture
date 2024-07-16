import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import request from 'supertest';

// Load Configuration
import '../../../src/utils/initial-values';

// Infrastructure
import { ChatEntity } from '../../../src/modules/chat/infrastructure/persistence/entities/Chat.entity';
import { SubstitutionEntity } from '../../../src/modules/chat/infrastructure/persistence/entities/Substitution.entity';
import { ProspectEntity } from '../../../src/modules/chat/infrastructure/persistence/entities/Prospect.entity';
import { HttpExceptionFilter } from '../../../src/modules/shared/infrastructure/http/filter/HttpExceptionFilter';

// Mocks
import { FakeChatBuilder } from '../../__mocks__/builders/FakeChatBuilder';
import { FakeSubstitutionBuilder } from '../../__mocks__/builders/FakeSubstitutionBuilder';
import { FakeProspectBuilder } from '../../__mocks__/builders/FakeProspectBuilder';

describe('GetChatWithSubstitutions (functional)', () => {
  let app: INestApplication;
  let chatEntityRepository: Repository<ChatEntity>;
  let substitutionEntityRepository: Repository<SubstitutionEntity>;
  let prospectEntityRepository: Repository<ProspectEntity>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        TypeOrmModule.forFeature([
          ChatEntity,
          SubstitutionEntity,
          ProspectEntity,
        ]),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();

    chatEntityRepository = moduleFixture.get('ChatEntityRepository');
    substitutionEntityRepository = moduleFixture.get(
      'SubstitutionEntityRepository',
    );
    prospectEntityRepository = moduleFixture.get('ProspectEntityRepository');
  });

  beforeEach(async () => {
    await chatEntityRepository.query(`DELETE FROM chat;`);
    await substitutionEntityRepository.query(`DELETE FROM substitution;`);
    await prospectEntityRepository.query(`DELETE FROM prospect;`);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be defined', () => {
    expect(chatEntityRepository).toBeDefined();
    expect(substitutionEntityRepository).toBeDefined();
    expect(prospectEntityRepository).toBeDefined();
  });

  it('should return a 400 http status when shippingGroup empty', async () => {
    const searchShippingGroup = {};

    const response = await request(app.getHttpServer())
      .get('/chat/withSubstitution')
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
      .get(`/chat/withSubstitution?shippingGroupId=${shippingGroupId}`)
      .send();

    expect(response.statusCode).toEqual(HttpStatus.NOT_FOUND);
    expect(response.body).toBeDefined();
    expect(response.body).toEqual({
      details: {
        message: 'There is no chat with that shippingGroupId no-exist',
        name: 'ApplicationError',
        response: 'There is no chat with that shippingGroupId no-exist',
        status: 404,
      },
      path: '/chat/withSubstitution?shippingGroupId=no-exist',
      statusCode: 404,
      timestamp: expect.any(String),
    });
  });

  it('should return a 200 http status when the chat exist but not substitution', async () => {
    const shippingGroupId = '91459756665';
    const chatEntity = new FakeChatBuilder()
      .withShippingGroupId(shippingGroupId)
      .build();
    await chatEntityRepository.save(chatEntity);

    const response = await request(app.getHttpServer())
      .get(`/chat/withSubstitution?shippingGroupId=${shippingGroupId}`)
      .send();

    expect(response.statusCode).toEqual(HttpStatus.OK);
    expect(response.body).toBeDefined();
    expect(response.body).toEqual({
      chat: {
        agreeExtraPaid: false,
        choice: 'UNANSWERED',
        customerPhone: '56952158950',
        id: expect.any(String),
        sendingDate: expect.any(String),
        shippingGroupId: '91459756665',
        customerId: 'customerId',
      },
      substitution: null,
    });
  });

  it('should return a 200 http status when the chat and substitution exist but not prospect', async () => {
    const shippingGroupId = '91459756665';
    const chatEntity = new FakeChatBuilder()
      .withShippingGroupId(shippingGroupId)
      .build();
    await chatEntityRepository.save(chatEntity);

    const substitutionEntity = new FakeSubstitutionBuilder()
      .withChatId(chatEntity.id)
      .withAgree('YES')
      .build();

    await substitutionEntityRepository.save(substitutionEntity);

    const response = await request(app.getHttpServer())
      .get(`/chat/withSubstitution?shippingGroupId=${shippingGroupId}`)
      .send();

    expect(response.statusCode).toEqual(HttpStatus.OK);
    expect(response.body).toBeDefined();
    expect(response.body).toEqual({
      chat: {
        agreeExtraPaid: false,
        choice: 'UNANSWERED',
        customerPhone: '56952158950',
        id: expect.any(String),
        sendingDate: expect.any(String),
        shippingGroupId: '91459756665',
        customerId: 'customerId',
      },
      substitution: {
        skuOriginal: {
          agree: 'YES',
          chatId: chatEntity.id,
          descriptionOriginal: 'descriptionOriginal',
          id: expect.any(String),
          messageId: 'messageId',
          prospect: [],
          skuOriginal: 'skuOriginal',
        },
      },
    });
  });

  it('should return a 200 http status when the chat, substitution and prospect exist', async () => {
    const shippingGroupId = '91459756665';
    const chatEntity = new FakeChatBuilder()
      .withShippingGroupId(shippingGroupId)
      .build();
    await chatEntityRepository.save(chatEntity);

    const substitutionEntity = new FakeSubstitutionBuilder()
      .withChatId(chatEntity.id)
      .withAgree('YES')
      .build();
    await substitutionEntityRepository.save(substitutionEntity);

    const prospectEntity = new FakeProspectBuilder()
      .withSubstitutionId(substitutionEntity.id)
      .build();

    await prospectEntityRepository.save(prospectEntity);

    const response = await request(app.getHttpServer())
      .get(`/chat/withSubstitution?shippingGroupId=${shippingGroupId}`)
      .send();

    expect(response.statusCode).toEqual(HttpStatus.OK);
    expect(response.body).toBeDefined();
    expect(response.body).toEqual({
      chat: {
        agreeExtraPaid: false,
        choice: 'UNANSWERED',
        customerPhone: '56952158950',
        id: chatEntity.id,
        sendingDate: expect.any(String),
        shippingGroupId: '91459756665',
        customerId: 'customerId',
      },
      substitution: {
        skuOriginal: {
          agree: 'YES',
          chatId: chatEntity.id,
          descriptionOriginal: 'descriptionOriginal',
          id: expect.any(String),
          messageId: 'messageId',
          prospect: [
            {
              description: 'description',
              extraPaid: 0,
              id: expect.any(String),
              sku: 'sku',
              subsidy: 0,
              substitutionId: substitutionEntity.id,
            },
          ],
          skuOriginal: 'skuOriginal',
        },
      },
    });
  });
});
