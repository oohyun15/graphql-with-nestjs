import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { External, IExternalable } from "src/externals/external.entity";

@Entity()
@ObjectType()
export class Webtoon implements IExternalable {
  @OneToMany(() => External, (external: External) => external.internalId)
  externals: External[];
  
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
