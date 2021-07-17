import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
@ObjectType()
export class Webtoon {
  @Field(type => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  title: string;

  @Field({ nullable: true })
  @Column({nullable: true })
  description?: string;

  @Field({ nullable: true })
  @Column({nullable: true })
  thumbanil?: string;

  @Field()
  @Column()
  grade_age?: number;

  @Field()
  @Column()
  week_day?: number;

  @Field()
  @Column()
  state?: number;

  @Field()
  @Column({ type: 'timestamp' })
  startDate: Date;

  @Field()
  @Column({ type: 'timestamp' })
  endDate: Date;
}
