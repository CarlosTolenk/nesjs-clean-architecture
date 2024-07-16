import { ExecutionContext, HttpStatus } from '@nestjs/common';

import { LoggerWinston } from '../../../../../src/modules/shared/infrastructure/logger/loggerWinston';
import { HeaderShippingGroup } from '../../../../../src/modules/shared/infrastructure/guards/HeaderShippingGroup';
import { InfrastructureError } from '../../../../../src/modules/shared/domain/exception';

describe('HeaderShippingGroup', () => {
  let headerShippingGroup: HeaderShippingGroup;
  let context: ExecutionContext;

  beforeEach(() => {
    headerShippingGroup = new HeaderShippingGroup(new LoggerWinston());
    context = {
      switchToHttp: jest.fn().mockReturnThis(),
      getType: jest.fn().mockReturnValue('http'),
      getRequest: jest.fn().mockReturnValue({
        headers: {
          'shipping-group': '12345',
        },
      }),
    } as unknown as ExecutionContext;
  });

  describe('canActivate', () => {
    it('should return true if shippingGroupId is present in the headers', () => {
      const result = headerShippingGroup.canActivate(context);

      expect(result).toBe(true);
    });

    it('should throw an InfrastructureError if shippingGroupId is not present in the headers', () => {
      (context['getRequest'] as jest.Mock).mockReturnValueOnce({
        headers: {},
      });

      expect(() => {
        headerShippingGroup.canActivate(context);
      }).toThrowError(
        new InfrastructureError(
          'You must indicate the shipping-group in the headers to be able to process your request',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });
  });
});
