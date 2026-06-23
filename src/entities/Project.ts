import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";
import { Task } from "./Task";

@Entity()
export class Project {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt!: Date;

  @Column()
  title!: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ default: "active" })
  status!: string;

  @ManyToOne(() => User, (user) => user.projects, { onDelete: "CASCADE" })
  user!: User;

  @OneToMany(() => Task, (task) => task.project)
  tasks!: Task[];
}
