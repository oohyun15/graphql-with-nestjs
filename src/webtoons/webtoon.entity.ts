import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  TableInheritance,
  Index,
  BeforeUpdate,
} from 'typeorm';

export enum WebtoonStatus {
  UNKNOWN = 10,
  CONTUNUE = 20,
  FINISH = 30,
  CLOSED = 40,
  SEASON_FINISH = 50,
}
registerEnumType(WebtoonStatus, { name: 'WebtoonStatus' });

@Entity()
@ObjectType()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
@Index(['type', 'identifier'], { unique: true })
export class Webtoon {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  type: string;

  @Field()
  @Column()
  identifier: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  @Column({ nullable: true, type: 'text' })
  description?: string;

  @Field(() => WebtoonStatus, { defaultValue: WebtoonStatus.UNKNOWN })
  @Column({ nullable: true, type: 'enum', enum: WebtoonStatus })
  status?: WebtoonStatus;

  @Field({ nullable: true })
  @Column({ nullable: true })
  gradeAge?: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  weekDay?: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  thumbnail?: string;

  @Field({ nullable: true })
  @Column({ nullable: true, type: 'timestamp' })
  startDate?: Date;

  @Field({ nullable: true })
  @Column({ nullable: true, type: 'timestamp' })
  endDate?: Date;

  @Field({ nullable: true })
  @Column({ nullable: true, type: 'text' })
  data?: string;

  @Field()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Field()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @BeforeUpdate()
  updateTimestamp() {
    this.updatedAt = new Date();
  }
}
