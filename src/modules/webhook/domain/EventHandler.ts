import { EventBody } from './EventBody';

export interface EventHandler {
  execute(data: EventBody): Promise<void>;
}
