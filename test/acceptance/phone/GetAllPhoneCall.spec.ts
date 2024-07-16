import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import request from 'supertest';

// Modules
import { AppModule } from '../../../src/app.module';

// Load Configuration
import '../../../src/utils/initial-values';

// Infrastructure
import { PhoneCallEntity } from '../../../src/modules/phoneCall/infrastructure/persistence/entities/PhoneCall.entity';
import { HttpExceptionFilter } from '../../../src/modules/shared/infrastructure/http/filter/HttpExceptionFilter';
import { FakePhoneCallBuilder } from '../../__mocks__/builders/FakePhoneCallBuilder';

describe('GetAllPhoneCall (functional)', () => {
  let app: INestApplication;
  let phoneCallEntityRepository: Repository<PhoneCallEntity>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TypeOrmModule.forFeature([PhoneCallEntity])],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();

    phoneCallEntityRepository = moduleFixture.get('PhoneCallEntityRepository');
  });

  beforeEach(async () => {
    await phoneCallEntityRepository.query(`DELETE FROM phoneCall;`);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be defined', () => {
    expect(phoneCallEntityRepository).toBeDefined();
  });

  it('should return 400 http when params is not valid', async () => {
    const searchShippingGroup = {};

    const response = await request(app.getHttpServer())
      .get('/phoneCall')
      .send(searchShippingGroup);

    expect(response.statusCode).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('should return 404 http when phoneCall is empty', async () => {
    const shippingGroupId = 'shippingGroupId';

    const response = await request(app.getHttpServer()).get(
      `/phoneCall?shippingGroupId=${shippingGroupId}`,
    );

    expect(response.statusCode).toEqual(HttpStatus.OK);
    expect(response.body).toEqual([]);
  });

  it('should return 200 http when phoneCall exist by shippingGroup', async () => {
    const shippingGroupId = 'shippingGroupId';
    const phoneCallEntity1 = new FakePhoneCallBuilder()
      .withShippingGroupId(shippingGroupId)
      .withAnswer('YES')
      .withDuration('01:15')
      .build();
    const phoneCallEntity2 = new FakePhoneCallBuilder()
      .withShippingGroupId(shippingGroupId)
      .withAnswer('NO')
      .build();
    await phoneCallEntityRepository.save([phoneCallEntity1, phoneCallEntity2]);

    const response = await request(app.getHttpServer()).get(
      `/phoneCall?shippingGroupId=${shippingGroupId}`,
    );

    expect(response.statusCode).toEqual(HttpStatus.OK);
    expect(response.body).toEqual([
      {
        answer: 'YES',
        customerPhone: '56952158950',
        date: expect.any(String),
        duration: '01:15',
        id: expect.any(String),
        pickerPhone: '56952158951',
        shippingGroupId: shippingGroupId,
      },
      {
        answer: 'NO',
        customerPhone: '56952158950',
        date: expect.any(String),
        duration: 'N/A',
        id: expect.any(String),
        pickerPhone: '56952158951',
        shippingGroupId: shippingGroupId,
      },
    ]);
  });
});
