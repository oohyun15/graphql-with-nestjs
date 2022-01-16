import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  TableInheritance,
  Index,
  BeforeUpdate,
} from 'typeorm';

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
@Index(['type', 'identifier'], { unique: true })
export class Webtoon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  identifier: string;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({ nullable: true })
  status: number;

  @Column({ nullable: true })
  gradeAge: number;

  @Column({ nullable: true })
  weekDay: number;

  @Column({ nullable: true, type: 'timestamp' })
  startDate: Date;

  @Column({ nullable: true, type: 'timestamp' })
  endDate: Date;

  @Column({ nullable: true, type: 'text' })
  data: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @BeforeUpdate()
  updateTimestamp() {
    this.updatedAt = new Date();
  }
}
