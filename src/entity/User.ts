import { userInfo } from "os";
import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";
import { Joke } from "./Joke";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    firstName!: string;

    @Column()
    lastName!: string;

    @Column()
    displayname!: string;

    @Column()
    age!: number;

    @Column()
    mail!: string;

    @OneToMany(type => Joke, jokes => jokes.user)
    jokes!: Joke;
}
