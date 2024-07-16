import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { of } from 'rxjs';
import { HttpService } from '@nestjs/axios';

// Infrastructure
import { OutgoingRequestTimingInterceptor } from '../../../../../src/modules/shared/infrastructure/interceptors/OutgoingRequestTiming';
import { LoggerWinston } from '../../../../../src/modules/shared/infrastructure/logger/loggerWinston';

describe('OutgoingRequestTimingInterceptor', () => {
  let interceptor: OutgoingRequestTimingInterceptor;
  let httpService: HttpService;
  let loggerSpy: jest.SpyInstance;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OutgoingRequestTimingInterceptor,
        LoggerWinston,
        {
          provide: HttpService,
          useValue: {
            axiosRef: {
              interceptors: {
                response: {
                  use: jest.fn(),
                },
              },
              request: jest.fn(),
            },
            request: jest.fn(),
          },
        },
      ],
    }).compile();

    interceptor = module.get<OutgoingRequestTimingInterceptor>(
      OutgoingRequestTimingInterceptor,
    );
    httpService = module.get<HttpService>(HttpService);
    loggerSpy = jest.spyOn(LoggerWinston.prototype, 'info');
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should measure outgoing request time', (done) => {
    const requestUrl = 'https://api.example.com';
    const responseMock: AxiosResponse = {
      config: {
        url: requestUrl,
        headers: undefined,
      },
      data: {},
      status: 200,
      statusText: 'OK',
      headers: {},
    };

    jest
      .spyOn(httpService, 'request')
      .mockImplementationOnce(() => of(responseMock));

    type MyExecutionContext<T = any> = ExecutionContext & {
      getRequest: () => T;
      getResponse: () => Response;
      getNext: () => any;
    };

    function createMockExecutionContext<T = any>(
      request: T,
    ): MyExecutionContext<T> {
      return {
        switchToHttp: () => ({
          getRequest: () => request,
          getResponse: () => null,
          getNext: () => null,
        }),
      } as MyExecutionContext<T>;
    }
    const mockRequestObject = { url: requestUrl };
    const mockExecutionContext = createMockExecutionContext(mockRequestObject);

    interceptor
      .intercept(mockExecutionContext, { handle: () => of(responseMock) })
      .subscribe(() => {
        expect(loggerSpy).toHaveBeenCalledWith(
          `[Outgoing] request to ${requestUrl} took`,
          expect.objectContaining({
            elapsedTime: expect.any(Number),
          }),
        );
        done();
      });
  });
});
