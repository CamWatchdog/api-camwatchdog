import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import Enum from '../../enum';
import { UUID } from 'crypto';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', nullable: false })
  @Generated('uuid')
  userId: UUID;

  @Column({ type: 'varchar', length: 200, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 11, nullable: false })
  cpf: string;

  @Column({ type: 'varchar', nullable: true })
  email: string;

  @Column({ type: 'varchar', nullable: false })
  password: string;

  @CreateDateColumn({
    type: 'timestamptz',
    nullable: false,
    default: 'NOW()',
  })
  createdAt: string;

  @UpdateDateColumn({ type: 'timestamptz', nullable: true, onUpdate: 'NOW()' })
  updatedAt: string;

  @Column({ type: 'varbit', nullable: false, default: '1' })
  isActive: boolean;

  @Column({ type: 'int', nullable: false, default: Enum.Role.Common })
  role: number;
}
