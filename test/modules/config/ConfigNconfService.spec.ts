import { ConfigNconfService } from '../../../src/modules/config/ConfigNconfService';

jest.mock('nconf', () => {
  return {
    get: jest.fn().mockReturnValue({ key: 'Test' }),
    set: jest.fn().mockReturnValue(null),
  };
});

describe('ConfigNconfService', () => {
  let configNconfService: ConfigNconfService;

  beforeEach(() => {
    configNconfService = new ConfigNconfService();
  });

  it('should return the config object', () => {
    const expectedConfig = { key: 'Test' };

    const config = configNconfService.getConfig();

    expect(config).toEqual(expectedConfig);
  });

  it('should set the config value', () => {
    const key = 'testKey';
    const value = 'testValue';

    configNconfService.setConfig(key, value);
  });
});
