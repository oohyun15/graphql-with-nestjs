import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
@ObjectType()
export class Recipe {
  @Field(type => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  title: string;

  @Field({ nullable: true })
  @Column({nullable: true })
  description?: string;

  @Field()
  @Column({ type: 'timestamp' })
  createdAt: Date;

  @Field(type => String)
  @Column()
  ingredients: string;
}