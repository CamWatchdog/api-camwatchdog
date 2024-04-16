import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Computer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  token: string;

  @Column({ type: 'varchar', nullable: false })
  description: string;

  @Column({ type: 'bit', nullable: false, default: 1 })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamp', nullable: false })
  createdAt: string;
}
