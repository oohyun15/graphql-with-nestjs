import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  TableInheritance,
} from 'typeorm';

export interface IExternalable {
  externals: External[];
  id: number;
}

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
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
