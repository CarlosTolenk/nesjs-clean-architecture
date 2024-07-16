import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { SubstitutionEntity } from './Substitution.entity';
import { Chat, ChoiceAvailableType } from '../../../domain/Chat';

type Params = {
  shippingGroupId: string;
  customerPhone: string;
  customerId: string;
  sendingDate: string;
  choice: string;
};

@Entity({ name: 'chat' })
export class ChatEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  shippingGroupId: string;

  @Column()
  choice: string;

  @Column()
  customerPhone: string;

  @Column()
  customerId: string;

  @Column()
  date: string;

  @Column()
  agreeExtraPaid: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => SubstitutionEntity, (substitution) => substitution.chatId)
  substitutions: SubstitutionEntity[];

  static create(param: Params): ChatEntity {
    const entity = new ChatEntity();
    entity.shippingGroupId = param.shippingGroupId;
    entity.customerPhone = param.customerPhone;
    entity.customerId = param.customerId;
    entity.date = param.sendingDate;
    entity.agreeExtraPaid = false;
    entity.id = uuidv4();
    entity.choice = ChoiceAvailableType.UNANSWERED;
    return entity;
  }

  static fromDomain(chat: Chat): ChatEntity {
    const entity = new ChatEntity();
    entity.shippingGroupId = chat.shippingGroupId.value;
    entity.customerPhone = chat.customerPhone.value;
    entity.customerId = chat.customerId.value;
    entity.date = chat.sendingDate;
    entity.agreeExtraPaid = chat.agreeExtraPaid;
    entity.id = chat.id;
    entity.choice = chat.choice;
    entity.createdAt = chat.createdAt;
    entity.updatedAt = chat.updatedAt;
    return entity;
  }
}
