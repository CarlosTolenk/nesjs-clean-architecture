import { Test, TestingModule } from '@nestjs/testing';

// Domain
import { PhoneCallRepository } from '../../../../../src/modules/phoneCall/domain/PhoneCallRepository';
import { ILogger } from '../../../../../src/modules/shared/domain/Logger';
import { MakeCallRepository } from '../../../../../src/modules/phoneCall/domain/MakeCallRepository';

// Application
import { MakeCall } from '../../../../../src/modules/phoneCall/application/useCases/MakeCall';
import { CallService } from '../../../../../src/modules/phoneCall/application/services/CallServices';

// Infrastructure
import { MakeCallDto } from '../../../../../src/modules/phoneCall/infrastructure/http/dto/makeCall.dto';

// Mocks
import { PhoneCallRepositoryMock } from '../../../../__mocks__/PhoneCallRepositoryMock';
import { MakeCallRepositoryMock } from '../../../../__mocks__/MakeCallRepositoryMock';
import {
  ApplicationError,
  InfrastructureError,
} from '../../../../../src/modules/shared/domain/exception';
import { HttpStatus } from '@nestjs/common';
import { DomainError } from '../../../../../src/modules/shared/domain/exception/DomainError';

describe('MakeCall', () => {
  let useCase: MakeCall;
  let phoneCallRepository: PhoneCallRepository;
  let makeCallRepository: MakeCallRepository;
  let service: CallService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MakeCall,
        CallService,
        {
          provide: PhoneCallRepository,
          useClass: PhoneCallRepositoryMock,
        },
        {
          provide: MakeCallRepository,
          useClass: MakeCallRepositoryMock,
        },
        { provide: ILogger, useValue: { error: jest.fn() } },
      ],
    }).compile();

    useCase = module.get<MakeCall>(MakeCall);
    phoneCallRepository = module.get<PhoneCallRepository>(PhoneCallRepository);
    makeCallRepository = module.get<MakeCallRepository>(MakeCallRepository);
    service = module.get<CallService>(CallService);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
    expect(phoneCallRepository).toBeDefined();
    expect(service).toBeDefined();
  });

  it('should return a correct response and invoke persistence of the call', async () => {
    const makeCallDto = new MakeCallDto();
    makeCallDto.shippingGroupId = 'shippingGroupId';
    makeCallDto.customerCellphone = '56952158950';
    makeCallDto.pickerCellphone = '56952158951';
    makeCallDto.customerId = 'customerId';
    const spyPhoneCallRepository = jest.spyOn(phoneCallRepository, 'save');
    const spyMakeCallRepository = jest
      .spyOn(makeCallRepository, 'execute')
      .mockResolvedValue('notificationId');

    const result = await useCase.execute(makeCallDto);

    expect(spyPhoneCallRepository).toHaveBeenCalledWith(
      expect.objectContaining({
        answer: 'N/A',
        customerPhone: { value: '56952158950' },
        date: expect.any(String),
        duration: '',
        id: '',
        notificationId: 'notificationId',
        pickerPhone: { value: '56952158951' },
        shippingGroupId: { value: 'shippingGroupId' },
        customerId: { value: 'customerId' },
      }),
    );
    expect(spyMakeCallRepository).toHaveBeenCalledWith(
      expect.objectContaining({
        channel: 'PICKING',
        customer: {
          cellphone: {
            value: '56952158950',
          },
          customerId: {
            value: 'customerId',
          },
        },
        event: 'LIDER_CALL_SOD_PICKING_SUBSTITUTION',
        from: {
          cellphone: {
            value: '56952158951',
          },
        },
        sendingDate: {
          value: expect.any(String),
        },
        shippingGroupId: {
          value: 'shippingGroupId',
        },
      }),
    );
    expect(result).toEqual({
      message: 'Will call you',
      status: 'Ok',
      token: 'notificationId',
    });
  });

  it('should return an error when an error occurs in the call and the call is not saved', async () => {
    const makeCallDto = new MakeCallDto();
    makeCallDto.shippingGroupId = 'shippingGroupId';
    makeCallDto.customerCellphone = '56952158950';
    makeCallDto.pickerCellphone = '56952158951';
    makeCallDto.customerId = 'customerId';

    const spyPhoneCallRepository = jest.spyOn(phoneCallRepository, 'save');
    const spyMakeCallRepository = jest
      .spyOn(makeCallRepository, 'execute')
      .mockRejectedValue(
        new InfrastructureError('Error', HttpStatus.SERVICE_UNAVAILABLE),
      );

    await expect(useCase.execute(makeCallDto)).rejects.toThrowError(
      new InfrastructureError('Error', HttpStatus.SERVICE_UNAVAILABLE),
    );
    expect(spyMakeCallRepository).toHaveBeenCalledWith(
      expect.objectContaining({
        channel: 'PICKING',
        customer: {
          cellphone: {
            value: '56952158950',
          },
          customerId: {
            value: 'customerId',
          },
        },
        event: 'LIDER_CALL_SOD_PICKING_SUBSTITUTION',
        from: {
          cellphone: {
            value: '56952158951',
          },
        },
        sendingDate: {
          value: expect.any(String),
        },
        shippingGroupId: {
          value: 'shippingGroupId',
        },
      }),
    );
    expect(spyPhoneCallRepository).not.toHaveBeenCalled();
  });

  it('should return a domain handled error when the call fails and the call is not saved - shippingGroupId empty', async () => {
    const makeCallDto = new MakeCallDto();
    makeCallDto.shippingGroupId = '';
    makeCallDto.customerCellphone = '50952158950';
    makeCallDto.pickerCellphone = '56952158951';
    makeCallDto.customerId = 'customerId';

    jest.spyOn(phoneCallRepository, 'save');
    jest.spyOn(makeCallRepository, 'execute');

    await expect(useCase.execute(makeCallDto)).rejects.toThrowError(
      new DomainError(
        '<ShippingGroupId> does not allow the value empty',
        HttpStatus.BAD_REQUEST,
      ),
    );
  });

  it('should return a domain handled error when the call fails and the call is not saved - cellphone 1', async () => {
    const makeCallDto = new MakeCallDto();
    makeCallDto.shippingGroupId = 'shippingGroupId';
    makeCallDto.customerCellphone = '50952158950';
    makeCallDto.pickerCellphone = '56952158951';
    makeCallDto.customerId = 'customerId';

    jest.spyOn(phoneCallRepository, 'save');
    jest.spyOn(makeCallRepository, 'execute');

    await expect(useCase.execute(makeCallDto)).rejects.toThrowError(
      new DomainError(
        'The Cellphone <50952158950> is not valid',
        HttpStatus.BAD_REQUEST,
      ),
    );
  });

  it('should return a domain handled error when the call fails and the call is not saved - cellphone 2', async () => {
    const makeCallDto = new MakeCallDto();
    makeCallDto.shippingGroupId = 'shippingGroupId';
    makeCallDto.customerCellphone = '56952158950';
    makeCallDto.pickerCellphone = '50952158951';
    makeCallDto.customerId = 'customerId';

    jest.spyOn(phoneCallRepository, 'save');
    jest.spyOn(makeCallRepository, 'execute');

    await expect(useCase.execute(makeCallDto)).rejects.toThrowError(
      new DomainError(
        'The Cellphone <50952158951> is not valid',
        HttpStatus.BAD_REQUEST,
      ),
    );
  });

  it('should return a handled error when an error occurs in the call and the call is not saved', async () => {
    const makeCallDto = new MakeCallDto();
    makeCallDto.shippingGroupId = 'shippingGroupId';
    makeCallDto.customerCellphone = '56952158950';
    makeCallDto.pickerCellphone = '56952158951';
    makeCallDto.customerId = 'customerId';

    const spyPhoneCallRepository = jest.spyOn(phoneCallRepository, 'save');
    const spyMakeCallRepository = jest
      .spyOn(makeCallRepository, 'execute')
      .mockRejectedValue(new Error('Error'));

    await expect(useCase.execute(makeCallDto)).rejects.toThrowError(
      new ApplicationError(
        '[SG:shippingGroupId] Error trying to call the customer',
        HttpStatus.CONFLICT,
      ),
    );
    expect(spyMakeCallRepository).toHaveBeenCalledWith(
      expect.objectContaining({
        channel: 'PICKING',
        customer: {
          cellphone: {
            value: '56952158950',
          },
          customerId: {
            value: 'customerId',
          },
        },
        event: 'LIDER_CALL_SOD_PICKING_SUBSTITUTION',
        from: {
          cellphone: {
            value: '56952158951',
          },
        },
        sendingDate: {
          value: expect.any(String),
        },
        shippingGroupId: {
          value: 'shippingGroupId',
        },
      }),
    );
    expect(spyPhoneCallRepository).not.toHaveBeenCalled();
  });

  it('should return an error when persistence of the call fails', async () => {
    const makeCallDto = new MakeCallDto();
    makeCallDto.shippingGroupId = 'shippingGroupId';
    makeCallDto.customerCellphone = '56952158950';
    makeCallDto.pickerCellphone = '56952158951';
    makeCallDto.customerId = 'customerId';

    const spyMakeCallRepository = jest.spyOn(makeCallRepository, 'execute');
    const spyPhoneCallRepository = jest
      .spyOn(phoneCallRepository, 'save')
      .mockRejectedValue(
        new InfrastructureError('Error BD', HttpStatus.SERVICE_UNAVAILABLE),
      );

    await expect(useCase.execute(makeCallDto)).rejects.toThrowError(
      new InfrastructureError('Error BD', HttpStatus.SERVICE_UNAVAILABLE),
    );
    expect(spyPhoneCallRepository).toHaveBeenCalledWith(
      expect.objectContaining({
        answer: 'N/A',
        customerPhone: { value: '56952158950' },
        date: expect.any(String),
        duration: '',
        id: '',
        notificationId: '',
        pickerPhone: { value: '56952158951' },
        shippingGroupId: { value: 'shippingGroupId' },
        customerId: { value: 'customerId' },
      }),
    );

    expect(spyMakeCallRepository).toHaveBeenCalledWith(
      expect.objectContaining({
        channel: 'PICKING',
        customer: {
          cellphone: {
            value: '56952158950',
          },
          customerId: {
            value: 'customerId',
          },
        },
        event: 'LIDER_CALL_SOD_PICKING_SUBSTITUTION',
        from: {
          cellphone: {
            value: '56952158951',
          },
        },
        sendingDate: {
          value: expect.any(String),
        },
        shippingGroupId: {
          value: 'shippingGroupId',
        },
      }),
    );
  });
});
