import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ChatEntity } from './Chat.entity';
import { ProspectEntity } from './Prospect.entity';

@Entity({ name: 'substitution' })
export class SubstitutionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  messageId: string;

  @Column()
  agree: string;

  @Column()
  descriptionOriginal: string;

  @Column()
  skuOriginal: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  chatId: string;

  @OneToMany(() => ProspectEntity, (prospect) => prospect.substitutionId)
  prospects: ProspectEntity[];

  @ManyToOne(() => ChatEntity, (chatEntity) => chatEntity.id)
  @JoinColumn({ name: 'chatId', referencedColumnName: 'id' })
  chats: any[];
}
