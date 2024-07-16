import { Test, TestingModule } from '@nestjs/testing';

// Domain
import { PhoneCallRepository } from '../../../../../src/modules/phoneCall/domain/PhoneCallRepository';

// Application
import { GetAllPhoneCall } from '../../../../../src/modules/phoneCall/application/useCases/GetAllPhoneCall';

// Mocks
import { PhoneCallRepositoryMock } from '../../../../__mocks__/PhoneCallRepositoryMock';
import { SearchShippingGroupIdDto } from '../../../../../src/modules/phoneCall/infrastructure/http/dto/searchShippingGroupId.dto';
import { InfrastructureError } from '../../../../../src/modules/shared/domain/exception';
import { HttpStatus } from '@nestjs/common';
import { PhoneCall } from '../../../../../src/modules/phoneCall/domain/PhoneCall';
import { ShippingGroupId } from '../../../../../src/modules/shared/domain/valueObject/ShippingGroupId';
import { Cellphone } from '../../../../../src/modules/shared/domain/valueObject/Cellphone';

describe('GetAllPhoneCall', () => {
  let useCase: GetAllPhoneCall;
  let phoneCallRepository: PhoneCallRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        GetAllPhoneCall,
        {
          provide: PhoneCallRepository,
          useClass: PhoneCallRepositoryMock,
        },
      ],
    }).compile();

    useCase = module.get<GetAllPhoneCall>(GetAllPhoneCall);
    phoneCallRepository = module.get<PhoneCallRepository>(PhoneCallRepository);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
    expect(phoneCallRepository).toBeDefined();
  });

  it('should correctly return an array of calls', async () => {
    const shippingGroupIdDto = new SearchShippingGroupIdDto();
    shippingGroupIdDto.shippingGroupId = 'shippingGroupId';

    const expectedPhoneCall = [
      PhoneCall.create({
        id: 'id-uuid-1',
        shippingGroupId: 'shippingGroupId',
        answer: 'YES',
        customerPhone: '56952158950',
        pickerPhone: '56952158951',
        date: '2024-07-03',
        duration: '04:25',
        notificationId: 'notificationId',
        customerId: 'customerId',
      }),
      PhoneCall.create({
        id: 'id-uuid-2',
        shippingGroupId: 'shippingGroupId2',
        answer: 'NOT',
        customerPhone: '56952158950',
        pickerPhone: '56952158951',
        date: '2024-07-03',
        duration: '04:25',
        notificationId: 'notificationId',
        customerId: 'customerId',
      }),
    ];

    const spyRepository = jest
      .spyOn(phoneCallRepository, 'getAllByShippingGroup')
      .mockResolvedValue(expectedPhoneCall);

    const result = await useCase.execute(shippingGroupIdDto);

    expect(spyRepository).toHaveBeenCalled();
    expect(result).toEqual([
      {
        answer: 'YES',
        customerPhone: '56952158950',
        date: '2024-07-03',
        duration: '04:25',
        id: 'id-uuid-1',
        pickerPhone: '56952158951',
        shippingGroupId: 'shippingGroupId',
      },
      {
        answer: 'NOT',
        customerPhone: '56952158950',
        date: '2024-07-03',
        duration: '04:25',
        id: 'id-uuid-2',
        pickerPhone: '56952158951',
        shippingGroupId: 'shippingGroupId2',
      },
    ]);
  });

  it('should correctly return an array of empty calls', async () => {
    const shippingGroupIdDto = new SearchShippingGroupIdDto();
    shippingGroupIdDto.shippingGroupId = 'shippingGroupId';

    const expectedPhoneCall = [];

    const spyRepository = jest
      .spyOn(phoneCallRepository, 'getAllByShippingGroup')
      .mockResolvedValue(expectedPhoneCall);

    const result = await useCase.execute(shippingGroupIdDto);

    expect(result).toEqual([]);
  });

  it('should throw an error if an exception occurs', async () => {
    const shippingGroupIdValue = 'shippingGroupId';
    const shippingGroupIdDto = new SearchShippingGroupIdDto();
    shippingGroupIdDto.shippingGroupId = shippingGroupIdValue;

    const spyRepository = jest
      .spyOn(phoneCallRepository, 'getAllByShippingGroup')
      .mockRejectedValue(
        new InfrastructureError('Not phoneCall', HttpStatus.NOT_FOUND),
      );

    await expect(useCase.execute(shippingGroupIdDto)).rejects.toThrowError(
      new InfrastructureError('Not phoneCall', HttpStatus.NOT_FOUND),
    );
    expect(spyRepository).toHaveBeenCalledWith(shippingGroupIdValue);
  });
});
