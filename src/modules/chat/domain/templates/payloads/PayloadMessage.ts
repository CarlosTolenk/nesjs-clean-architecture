export interface PayloadMessage<T> {
  fromRequest(): T;
}
