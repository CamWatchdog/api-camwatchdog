import { UUID } from 'crypto';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Computer {
  @PrimaryGeneratedColumn('uuid')
  computerId: UUID;

  @Column({ type: 'varchar', nullable: false })
  token: string;

  @Column({ type: 'varchar', nullable: false })
  description: string;

  @Column({ type: 'bit', nullable: false, default: 1 })
  isActive: 0 | 1;

  @CreateDateColumn({ type: 'timestamp', nullable: false })
  createdAt: string;
}
