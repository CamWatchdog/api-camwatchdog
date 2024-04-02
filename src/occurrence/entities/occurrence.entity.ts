import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Occurrence {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 200, nullable: false })
  user: string;

  @CreateDateColumn({ type: 'timestamp', nullable: false })
  createdAt: string;

  @Column({ type: 'varchar', nullable: false })
  printFilePath: string;

  @Column({ type: 'varchar', nullable: false })
  frameFilePath: string;
}
