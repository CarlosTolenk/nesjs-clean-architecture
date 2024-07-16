import crypto from 'crypto';
import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';

// Domain
import { InfrastructureError } from '../../../../../../src/modules/shared/domain/exception';

// Infrastructure
import { GenerateWithSR } from '../../../../../../src/modules/shared/infrastructure/http/headers/GenerateWithSR';

// Config
import { IConfigAPIWithSR } from '../../../../../../src/modules/config/ConfigInterface';

describe('GenerateWithSR', () => {
  let generateWithSR: GenerateWithSR;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GenerateWithSR],
    }).compile();

    generateWithSR = module.get<GenerateWithSR>(GenerateWithSR);
  });

  it('should return valid headers', async () => {
    crypto.Sign.prototype.update = jest.fn().mockReturnThis();
    crypto.Sign.prototype.sign = jest.fn().mockReturnValue('fake-sign');
    const spyCreateSign = jest.spyOn(crypto, 'createSign');
    const config: IConfigAPIWithSR = {
      endpoint: 'endpoint',
      consumerId: '123',
      privateKey: 'privateKey',
      keyVersion: 'v1',
      name: 'serviceName',
      env: 'production',
    };

    const headers = await generateWithSR.getHeaders(config);

    expect(spyCreateSign).toHaveBeenCalledWith('RSA-SHA256');
    expect(headers).toEqual({
      'Content-Type': 'application/json',
      'WM_SVC.NAME': 'serviceName',
      'WM_SVC.ENV': 'production',
      'WM_CONSUMER.ID': '123',
      'WM_CONSUMER.INTIMESTAMP': expect.any(Number),
      'WM_SEC.AUTH_SIGNATURE': expect.any(String),
    });
  });

  it('should return invalid headers when privateKey is null', async () => {
    const config: IConfigAPIWithSR = {
      endpoint: 'endpoint',
      consumerId: '123',
      privateKey: null,
      keyVersion: 'v1',
      name: 'serviceName',
      env: 'production',
    };

    const headers = await generateWithSR.getHeaders(config);

    expect(headers).toEqual({
      'Content-Type': 'application/json',
      'WM_SVC.NAME': 'serviceName',
      'WM_SVC.ENV': 'production',
      'WM_CONSUMER.ID': '123',
      'WM_CONSUMER.INTIMESTAMP': expect.any(Number),
      'WM_SEC.AUTH_SIGNATURE': 0,
    });
  });

  it('should throw error', async () => {
    crypto.Sign.prototype.update = jest.fn().mockReturnValue(new Error('sds'));
    crypto.Sign.prototype.sign = jest.fn().mockReturnValue('fake-sign');
    jest.spyOn(crypto, 'createSign');
    const config: IConfigAPIWithSR = {
      endpoint: 'endpoint',
      consumerId: '123',
      privateKey: 'privateKey',
      keyVersion: 'v1',
      name: 'serviceName',
      env: 'production',
    };

    await expect(generateWithSR.getHeaders(config)).rejects.toThrowError(
      new InfrastructureError(
        'Could not sign the headers to make requests',
        HttpStatus.NOT_IMPLEMENTED,
      ),
    );
  });
});
