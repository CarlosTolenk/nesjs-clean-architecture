import { Test, TestingModule } from '@nestjs/testing';

// Domain
import { ILogger } from '../../../../../src/modules/shared/domain/Logger';
import { InfrastructureError } from '../../../../../src/modules/shared/domain/exception';

// Application
import { MakeCall } from '../../../../../src/modules/phoneCall/application/useCases/MakeCall';
import { GetAllPhoneCall } from '../../../../../src/modules/phoneCall/application/useCases/GetAllPhoneCall';

// Infrastructure
import { MakeCallDto } from '../../../../../src/modules/phoneCall/infrastructure/http/dto/makeCall.dto';
import { PhoneCallController } from '../../../../../src/modules/phoneCall/infrastructure/http/phoneCall.controller';
import { SearchShippingGroupIdDto } from '../../../../../src/modules/phoneCall/infrastructure/http/dto/searchShippingGroupId.dto';
import { PhoneCallDto } from '../../../../../src/modules/phoneCall/infrastructure/http/dto/phoneCall.dto';

describe('PhoneCallController', () => {
  let controller: PhoneCallController;
  let useCaseMakeCall: MakeCall;
  let useCaseGetAllPhone: GetAllPhoneCall;
  let logger: ILogger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PhoneCallController],
      providers: [
        { provide: MakeCall, useValue: { execute: jest.fn() } },
        { provide: GetAllPhoneCall, useValue: { execute: jest.fn() } },
        { provide: ILogger, useValue: { error: jest.fn() } },
      ],
    }).compile();

    controller = module.get<PhoneCallController>(PhoneCallController);
    useCaseMakeCall = module.get<MakeCall>(MakeCall);
    useCaseGetAllPhone = module.get<GetAllPhoneCall>(GetAllPhoneCall);
    logger = module.get<ILogger>(ILogger);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(useCaseMakeCall).toBeDefined();
    expect(useCaseGetAllPhone).toBeDefined();
    expect(logger).toBeDefined();
  });

  describe('getAllByShippingGroup', () => {
    it('should return phoneCall data correctly when array is empty', async () => {
      const params = new SearchShippingGroupIdDto();
      params.shippingGroupId = 'shippingGroupId';
      (useCaseGetAllPhone.execute as jest.Mock).mockResolvedValue([]);

      const result = await controller.getAllByShippingGroup(params);

      expect(result).toEqual([]);
    });

    it('should return phoneCall data correctly', async () => {
      const params = new SearchShippingGroupIdDto();
      params.shippingGroupId = 'shippingGroupId';

      const phoneCall1 = new PhoneCallDto();
      phoneCall1.id = 'uuid-1';
      phoneCall1.shippingGroupId = 'shippingGroupId';
      phoneCall1.answer = 'YES';
      phoneCall1.customerPhone = 'customerPhone';
      phoneCall1.pickerPhone = 'pickerPhone';
      phoneCall1.date = 'date';
      phoneCall1.duration = 'duration';

      const phoneCall2 = new PhoneCallDto();
      phoneCall1.id = 'uuid-2';
      phoneCall1.shippingGroupId = 'shippingGroupId';
      phoneCall1.answer = 'NO';
      phoneCall1.customerPhone = 'customerPhone';
      phoneCall1.pickerPhone = 'pickerPhone';
      phoneCall1.date = 'date';
      phoneCall1.duration = 'duration';

      const resultExpected: PhoneCallDto[] = [phoneCall1, phoneCall2];

      (useCaseGetAllPhone.execute as jest.Mock).mockResolvedValue(
        resultExpected,
      );

      const result = await controller.getAllByShippingGroup(params);

      expect(result).toEqual(resultExpected);
    });

    it('should handle error correctly', async () => {
      const params = new SearchShippingGroupIdDto();
      params.shippingGroupId = 'shippingGroupId';

      const error = new InfrastructureError('Test error', 400);
      const spyLogger = jest.spyOn(logger, 'error');

      (useCaseGetAllPhone.execute as jest.Mock).mockRejectedValueOnce(error);

      try {
        await controller.getAllByShippingGroup(params);
      } catch (error) {
        expect(error).toBeDefined();
        expect(error).toEqual(error);
        expect(useCaseGetAllPhone.execute).toHaveBeenCalledWith(params);
        expect(spyLogger).toHaveBeenCalledWith(
          'Error to hit getAllByShippingGroup',
          {
            ...error,
          },
        );
      }
    });
  });

  describe('makeCall', () => {
    it('should return makeCall data correctly', async () => {
      const params = new MakeCallDto();
      params.shippingGroupId = 'shippingGroupId';
      params.customerCellphone = 'customerCellphone';
      params.pickerCellphone = 'pickerCellphone';

      const expectedResult = 'Test data';

      (useCaseMakeCall.execute as jest.Mock).mockResolvedValueOnce(
        expectedResult,
      );

      const result = await controller.makeCall(params);

      expect(result).toBe(expectedResult);
      expect(useCaseMakeCall.execute).toHaveBeenCalledWith(params);
    });

    it('should handle error correctly', async () => {
      const params = new MakeCallDto();
      params.shippingGroupId = 'shippingGroupId';
      params.customerCellphone = 'customerCellphone';
      params.pickerCellphone = 'pickerCellphone';

      const error = new InfrastructureError('Test error', 400);
      const spyLogger = jest.spyOn(logger, 'error');

      (useCaseMakeCall.execute as jest.Mock).mockRejectedValueOnce(error);

      try {
        await controller.makeCall(params);
      } catch (error) {
        expect(error).toBeDefined();
        expect(error).toEqual(error);
        expect(useCaseMakeCall.execute).toHaveBeenCalledWith(params);
        expect(spyLogger).toHaveBeenCalledWith('Error to hit makeCall', {
          ...error,
        });
      }
    });
  });
});
