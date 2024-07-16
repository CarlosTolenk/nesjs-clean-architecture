import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, HttpException } from '@nestjs/common';
import { HttpExceptionFilter } from '../../../../../../src/modules/shared/infrastructure/http/filter/HttpExceptionFilter';
import {
  ApplicationError,
  InfrastructureError,
} from '../../../../../../src/modules/shared/domain/exception';

const mockJson = jest.fn();
const mockStatus = jest.fn().mockImplementation(() => ({
  json: mockJson,
}));
const mockGetResponse = jest.fn().mockImplementation(() => ({
  status: mockStatus,
}));
const mockHttpArgumentsHost = jest.fn().mockImplementation(() => ({
  getResponse: mockGetResponse,
  getRequest: jest.fn(),
}));

const mockArgumentsHost = {
  switchToHttp: mockHttpArgumentsHost,
  getArgByIndex: jest.fn(),
  getArgs: jest.fn(),
  getType: jest.fn(),
  switchToRpc: jest.fn(),
  switchToWs: jest.fn(),
};

describe('HttpExceptionFilter', () => {
  let httpExceptionFilter: HttpExceptionFilter;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [HttpExceptionFilter],
    }).compile();
    httpExceptionFilter = module.get<HttpExceptionFilter>(HttpExceptionFilter);
  });

  describe('All exception filter tests', () => {
    it('should be defined', () => {
      expect(httpExceptionFilter).toBeDefined();
    });

    it('should return http exception when thrown from application [infrastructure]', () => {
      httpExceptionFilter.catch(
        new InfrastructureError('Http exception', HttpStatus.BAD_REQUEST),
        mockArgumentsHost,
      );
      expect(mockHttpArgumentsHost).toBeCalledTimes(1);
      expect(mockHttpArgumentsHost).toBeCalledWith();
      expect(mockGetResponse).toBeCalledTimes(1);
      expect(mockGetResponse).toBeCalledWith();
      expect(mockStatus).toBeCalledTimes(1);
      expect(mockStatus).toBeCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockJson).toBeCalledTimes(1);
      expect(mockJson).toBeCalledWith({
        details: new HttpException('Http exception', HttpStatus.BAD_REQUEST),
        path: undefined,
        statusCode: 400,
        timestamp: expect.any(String),
      });
    });

    it('should return http exception when thrown from application [application]', () => {
      httpExceptionFilter.catch(
        new ApplicationError(
          'Http exception',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
        mockArgumentsHost,
      );
      expect(mockHttpArgumentsHost).toBeCalledTimes(1);
      expect(mockHttpArgumentsHost).toBeCalledWith();
      expect(mockGetResponse).toBeCalledTimes(1);
      expect(mockGetResponse).toBeCalledWith();
      expect(mockStatus).toBeCalledTimes(1);
      expect(mockStatus).toBeCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockJson).toBeCalledTimes(1);
      expect(mockJson).toBeCalledWith({
        details: new HttpException(
          'Http exception',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
        path: undefined,
        statusCode: 500,
        timestamp: expect.any(String),
      });
    });

    it('should show a 500 error when an http exception is not returned', () => {
      httpExceptionFilter.catch(
        new Error('Unhandled error'),
        mockArgumentsHost,
      );
      expect(mockHttpArgumentsHost).toBeCalledTimes(1);
      expect(mockHttpArgumentsHost).toBeCalledWith();
      expect(mockGetResponse).toBeCalledTimes(1);
      expect(mockGetResponse).toBeCalledWith();
      expect(mockStatus).toBeCalledTimes(1);
      expect(mockStatus).toBeCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockJson).toBeCalledTimes(1);
      expect(mockJson).toBeCalledWith({
        details: new Error('Unhandled error'),
        path: undefined,
        statusCode: 500,
        timestamp: expect.any(String),
      });
    });
  });
});
