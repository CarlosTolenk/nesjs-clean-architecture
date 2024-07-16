export interface IConfigMap {
  socket: {
    enable: boolean;
    endpoint: string;
    pathEndpoint: string;
    indexKeys: string[];
    channels: {
      connection: string;
      connectionError: string;
      broadcast: string;
    };
  };
}
