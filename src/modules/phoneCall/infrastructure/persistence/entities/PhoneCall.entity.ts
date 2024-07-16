import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { DateTime } from 'luxon';
import { v4 as uuidv4 } from 'uuid';

DateTime.local().setZone('America/Santiago');

type Params = {
  shippingGroupId: string;
  customerPhone: string;
  pickerPhone: string;
  customerId: string;
  sendingDate: string;
  notificationId: string;
};

@Entity({ name: 'phoneCall' })
export class PhoneCallEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  shippingGroupId: string;

  @Column()
  answer: string;

  @Column()
  customerPhone: string;

  @Column()
  pickerPhone: string;

  @Column()
  customerId: string;

  @Column()
  notificationId: string;

  @Column()
  date: string;

  @Column()
  duration: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  static create(param: Params): PhoneCallEntity {
    const entity = new PhoneCallEntity();
    entity.shippingGroupId = param.shippingGroupId;
    entity.customerPhone = param.customerPhone;
    entity.pickerPhone = param.pickerPhone;
    entity.customerId = param.customerId;
    entity.notificationId = param.notificationId;
    entity.date = param.sendingDate;
    entity.id = uuidv4();
    entity.answer = 'N/A';
    entity.duration = 'N/A';
    return entity;
  }
}
