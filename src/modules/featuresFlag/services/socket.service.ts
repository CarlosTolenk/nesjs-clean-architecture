import { Injectable } from '@nestjs/common';
import { io, Socket } from 'socket.io-client';

// Services
import { FeaturesFlagService } from './features-flag.service';
import { ConfigEnvService } from '../../config/ConfigEnvService';

// Interfaces
import { IResult, IResultSocket, ISocketImplementation } from '../interfaces';
import { ILogger } from '../../shared/domain/Logger';
import { IConfigSocket } from '../../config/ConfigInterface';

@Injectable()
export class SocketService implements ISocketImplementation {
  private readonly socketClient: Socket;
  private readonly socketConfig: IConfigSocket;

  constructor(
    private readonly _featuresFlagService: FeaturesFlagService,
    private readonly _configEnvService: ConfigEnvService,
    private readonly logger: ILogger,
  ) {
    this.socketConfig = this.getSocketConfig();
    this.socketClient = this.createConnectionSocket();
  }

  private getSocketConfig(): IConfigSocket {
    return this._configEnvService.getConfig().socket;
  }

  private createConnectionSocket(): Socket {
    return io(`${this.socketConfig.endpoint}`, {
      path: '/websockets',
      transports: ['websocket'],
    });
  }

  onInit(): Promise<IResultSocket> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this.onConnection();
        this.onBroadcastChannel();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }

  onConnection(): Promise<IResultSocket> {
    return new Promise<IResultSocket>((resolve, reject) => {
      const { channels } = this.socketConfig;
      this.socketClient.on(channels.connection, (result: IResult) => {
        this.logger.info(`Socket connection in channel ${channels.connection}`);
        resolve(result);
      });
      this.socketClient.on(channels.connectionError, (error: Error) => {
        this.logger.error(
          `Error in socket connection ${channels.connectionError}`,
          {
            error,
          },
        );
        reject(error);
      });
    });
  }

  onBroadcastChannel(): void {
    const { channels } = this.socketConfig;
    this.socketClient.on(channels.broadcast, async (result: IResult) => {
      this.logger.info(`Receiving channel information ${channels.broadcast}`);
      if (this._featuresFlagService.isWriteInConfigMapsEnvironment(result)) {
        await this._featuresFlagService.setConfigMaps(result);
      } else {
        this.logger.info(
          `Cannot update because socket configuration is disabled in CCM2`,
        );
      }
    });
  }
}
