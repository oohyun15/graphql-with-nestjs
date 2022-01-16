import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  TableInheritance,
  Index,
} from 'typeorm';

export interface IExternalable {
  externals: External[];
  id: number;
}

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
@Index(['type', 'identifier'], { unique: true })
@Index(['internalId', 'internalType'])
export class External {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  internalId: number;

  @Column({ nullable: true, length: 100 })
  internalType: string;

  @Column()
  identifier: string;

  @Column({ nullable: true, type: 'text' })
  data: string;

  @Column({ nullable: true })
  status: number;
}
