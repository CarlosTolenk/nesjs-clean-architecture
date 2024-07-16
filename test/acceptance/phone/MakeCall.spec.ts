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
import { MakeCallDto } from '../../../src/modules/phoneCall/infrastructure/http/dto/makeCall.dto';

// Mocks
import { MakeCallMockServer } from '../../__mocks__/interceptors/Hermes/MakeCall';

describe('MakeCall', () => {
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
    const payloadMakeCall = {}; // MakeCallDto

    const response = await request(app.getHttpServer())
      .post('/phoneCall/makeCall')
      .send(payloadMakeCall);

    expect(response.statusCode).toEqual(HttpStatus.BAD_REQUEST);
    expect(response.body).toEqual({
      details: {
        message: 'Bad Request Exception',
        name: 'BadRequestException',
        options: {},
        response: {
          error: 'Bad Request',
          message: [
            'shippingGroupId must be a string',
            'customerCellphone must be a string',
            'pickerCellphone must be a string',
            'customerId must be a string',
          ],
          statusCode: 400,
        },
        status: 400,
      },
      path: '/phoneCall/makeCall',
      statusCode: 400,
      timestamp: expect.any(String),
    });
  });

  it('should return 409 http when hermes response 404', async () => {
    MakeCallMockServer.notFound();
    const shippingGroupId = 'shippingGroupId';
    const payloadMakeCall: MakeCallDto = {
      shippingGroupId,
      customerCellphone: '56952158950',
      pickerCellphone: '56952158952',
      customerId: 'customerId',
    };

    const response = await request(app.getHttpServer())
      .post('/phoneCall/makeCall')
      .send(payloadMakeCall);

    expect(response.statusCode).toEqual(HttpStatus.CONFLICT);

    const responseGet = await request(app.getHttpServer()).get(
      `/phoneCall?shippingGroupId=${shippingGroupId}`,
    );

    expect(responseGet.statusCode).toEqual(HttpStatus.OK);
    expect(responseGet.body).toEqual([]);
  });

  it('should return 409 http when hermes response 400', async () => {
    MakeCallMockServer.badRequest();
    const shippingGroupId = 'shippingGroupId';
    const payloadMakeCall: MakeCallDto = {
      shippingGroupId,
      customerCellphone: '56952158950',
      pickerCellphone: '56952158952',
      customerId: 'customerId',
    };

    const response = await request(app.getHttpServer())
      .post('/phoneCall/makeCall')
      .send(payloadMakeCall);

    expect(response.statusCode).toEqual(HttpStatus.CONFLICT);

    const responseGet = await request(app.getHttpServer()).get(
      `/phoneCall?shippingGroupId=${shippingGroupId}`,
    );

    expect(responseGet.statusCode).toEqual(HttpStatus.OK);
    expect(responseGet.body).toEqual([]);
  });

  it('should return 409 http when hermes response 500', async () => {
    MakeCallMockServer.fail();
    const shippingGroupId = 'shippingGroupId';
    const payloadMakeCall: MakeCallDto = {
      shippingGroupId,
      customerCellphone: '56952158950',
      pickerCellphone: '56952158952',
      customerId: 'customerId',
    };

    const response = await request(app.getHttpServer())
      .post('/phoneCall/makeCall')
      .send(payloadMakeCall);

    expect(response.statusCode).toEqual(HttpStatus.CONFLICT);

    const responseGet = await request(app.getHttpServer()).get(
      `/phoneCall?shippingGroupId=${shippingGroupId}`,
    );

    expect(responseGet.statusCode).toEqual(HttpStatus.OK);
    expect(responseGet.body).toEqual([]);
  });

  it('should return 200 http when hermes response 200', async () => {
    MakeCallMockServer.success();
    const shippingGroupId = 'shippingGroupId';
    const customerCellphone = '56952158950';
    const pickerCellphone = '56952158952';
    const payloadMakeCall: MakeCallDto = {
      shippingGroupId,
      customerCellphone: '56952158950',
      pickerCellphone: '56952158952',
      customerId: 'customerId',
    };

    const response = await request(app.getHttpServer())
      .post('/phoneCall/makeCall')
      .send(payloadMakeCall);

    expect(response.statusCode).toEqual(HttpStatus.OK);
    expect(response.body).toEqual({
      message: 'Will call you',
      status: 'Ok',
      token: 'notificationId',
    });

    const responseGet = await request(app.getHttpServer()).get(
      `/phoneCall?shippingGroupId=${shippingGroupId}`,
    );

    expect(responseGet.statusCode).toEqual(HttpStatus.OK);
    expect(responseGet.body).toEqual([
      {
        answer: 'N/A',
        customerPhone: customerCellphone,
        date: expect.any(String),
        duration: 'N/A',
        id: expect.any(String),
        pickerPhone: pickerCellphone,
        shippingGroupId: 'shippingGroupId',
      },
    ]);
  });
});
