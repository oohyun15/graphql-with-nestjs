import { Column, Entity, PrimaryGeneratedColumn, TableInheritance } from "typeorm";

export interface IExternalable {
  externals: External[];
  id: number;
}

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class External {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  internalId: number;

  @Column({ length: 100 })
  internalType: string;

  @Column()
  identifier: string;

  @Column({ type: "text" })
  data: string;

  @Column()
  status: number;
}