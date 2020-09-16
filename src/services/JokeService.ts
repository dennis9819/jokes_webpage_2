import { getManager, Repository } from "typeorm";
import { Category } from "../entity/Category";
import { Joke } from "../entity/Joke";
import { User } from "../entity/User";

export interface JokeResponse {
    id: number,
    author: string,
    text: string,
    upvotes: number,
    downvotes: number,
    views: number,
    category: string,
    categoryId: number,
}

export class JokeService {
    constructor(){
        // Nothing to do here
    }

    public async getRandomJoke(): Promise<JokeResponse> {
        const JokeRepo: Repository<Joke> = getManager().getRepository(Joke);
        const joke = await (JokeRepo.createQueryBuilder('joke')
            .leftJoinAndSelect('joke.user', 'user')
            .leftJoinAndSelect('joke.category', 'category')
            .orderBy("RAND()")
            .limit(1)
            .getOne()
        );
        if (joke === undefined){
            throw new Error("No Joke found");
        }
        JokeRepo.increment({ id: joke.id }, "views", 1);
        return {
            id: joke.id,
            author: joke.user.displayname,
            text: joke.joke,
            views: joke.views,
            upvotes: joke.upvotes,
            downvotes: joke.downvotes,
            category: joke.category.category,
            categoryId: joke.category.id
        };
    }

    public async upvote(jid: number): Promise<boolean> {
        const JokeRepo: Repository<Joke> = getManager().getRepository(Joke);
        try {
            await JokeRepo.increment({ id: jid }, "upvotes", 1);
            return true;
        } catch (error) {
            return false;
        }
    }

    public async downvote(jid: number): Promise<boolean> {
        const JokeRepo: Repository<Joke> = getManager().getRepository(Joke);
        try {
            await JokeRepo.increment({ id: jid }, "downvotes", 1);
            return true;
        } catch (error) {
            return false;
        }
    }

    public async getJoke(jid: number): Promise<JokeResponse> {
        const JokeRepo: Repository<Joke> = getManager().getRepository(Joke);
        const UserRepo: Repository<User> = getManager().getRepository(User);
        const CatRepo: Repository<Category> = getManager().getRepository(Category);

        const joke = await (JokeRepo.findOne({id: jid},{relations: ['user','category']}));
        if (joke === undefined){
            throw new Error("No Joke found");
        }
        JokeRepo.increment({ id: joke.id }, "views", 1);
        return {
            id: joke.id,
            author: joke.user.displayname,
            text: joke.joke,
            views: joke.views,
            upvotes: joke.upvotes,
            downvotes: joke.downvotes,
            category: joke.category.category,
            categoryId: joke.category.id
        };
    }
}