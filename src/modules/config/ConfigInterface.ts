interface IConfigLog {
  level: string;
}

interface IConfigAPIs {
  octopus?: IConfigAPIWithSR;
}

export interface IChannels {
  connection: string;
  connectionError: string;
  broadcast: string;
}

export interface IConfigSocket {
  enable: boolean;
  endpoint: string;
  pathEndpoint: string;
  indexKeys: string[];
  channels: IChannels;
}

export interface IConfigAPIWithSR {
  privateKey?: string;
  endpoint: string;
  name: string;
  env: string;
  consumerId: string;
  keyVersion: string;
  apiKey?: string;
}

export interface IConfigDB {
  host: string;
  port: number;
  username: string;
  database: string;
  password?: string;
  name: string;
  authenticationType: string;
  retryAttempts: number;
  retryDelay: number;
  connectionTimeout: number;
  requestTimeout: number;
  pool: {
    max: number;
    min: number;
    acquire: number;
    idle: number;
  };
}

export interface IConfigSendMessage {
  initialMessage: {
    callOptionButton: string;
    chooseForMeOptionButton: string;
    refundOptionButton: string;
  };
}

interface IConfigAPIs {
  hermes: IConfigAPIWithSR;
}

export interface IConfigEnv {
  isDevelopment: boolean;
  profile: string;
  port: number;
  log: IConfigLog;
  socket: IConfigSocket;
  namespace: string;
  hostname: string;
  db: IConfigDB;
  apis: IConfigAPIs;
  sendMessage: IConfigSendMessage;
}
