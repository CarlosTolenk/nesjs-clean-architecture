import { Chat } from './Chat';

export abstract class ChatRepository {
  abstract getByShippingGroup(shippingGroupId: string): Promise<Chat | null>;
  abstract save(chat: Chat): Promise<void>;
  abstract update(chat: Chat): Promise<void>;
}
