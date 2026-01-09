import 'reflect-metadata';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: 'varchar'})
  name!: string

  @Column({ type: 'varchar'})
  description!: string

  @Column({ type: 'float'})
  price!: number

  @Column({ type: 'int'})
  quantity!: number

  @Column({ type: 'varchar'})
  image!: string

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date
}