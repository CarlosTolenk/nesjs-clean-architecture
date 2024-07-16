export interface ISocketImplementation {
  onInit(): void;

  onConnection(): void;

  onBroadcastChannel(): void;
}
