import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn} from "typeorm";
import { Category } from "./Category";
import { User } from "./User";

@Entity()
export class Joke {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    header!: string;

    @Column({ type: "longtext"})
    joke!: string;

    @Column({nullable: true})
    source!: string;

    @Column({default: 0, type: "int"})
    upvotes!: number;

    @Column({default: 0, type: "int"})
    downvotes!: number;

    @Column({default: 0, type: "int"})
    views!: number;

    @ManyToOne(type => User, user => user.jokes)
    @JoinColumn()
    user!: User;

    @ManyToOne(type => Category, user => user.jokes)
    @JoinColumn()
    category!: Category;
}
