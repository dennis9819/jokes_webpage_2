import { userInfo } from "os";
import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";
import { Joke } from "./Joke";

@Entity()
export class Category {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    category!: string;

    @OneToMany(type => Joke, jokes => jokes.category)
    jokes!: Joke;
}
