import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SubstitutionEntity } from './Substitution.entity';

@Entity({ name: 'prospect' })
export class ProspectEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  description: string;

  @Column()
  sku: string;

  @Column()
  extraPaid: number;

  @Column()
  subsidy: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  substitutionId: string;

  @ManyToOne(() => SubstitutionEntity, (substitution) => substitution.id)
  @JoinColumn({ name: 'substitutionId', referencedColumnName: 'id' })
  substitutions: any[];
}
