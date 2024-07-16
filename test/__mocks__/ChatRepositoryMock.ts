import { ChatRepository } from '../../src/modules/chat/domain/ChatRepository';
import { Chat } from '../../src/modules/chat/domain/Chat';
import { Promise } from 'mssql';

export class ChatRepositoryMock extends ChatRepository {
  getByShippingGroup(shippingGroupId: string): Promise<Chat | null> {
    return Promise.resolve(null);
  }

  save(chat: Chat): Promise<void> {
    return Promise.resolve();
  }

  update(chat: Chat): Promise<void> {
    return Promise.resolve(undefined);
  }
}
