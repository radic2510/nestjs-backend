import {Injectable} from "@nestjs/common";
import {PassportSerializer} from "@nestjs/passport";
import {AuthService} from "./auth.service";
import {InjectRepository} from "@nestjs/typeorm";
import {Users} from "../entities/user.entity";
import {Repository} from "typeorm";

@Injectable()
export class LocalSerializer extends PassportSerializer {
    constructor(
        private readonly authService: AuthService,
        @InjectRepository(Users) private usersRepository: Repository<Users>,
    ) {
        super();
    }

    serializeUser(user: any, done: CallableFunction): any {
        done(null, user.id);
    }

    async deserializeUser(userId: string, done: CallableFunction) {
        return await this.usersRepository
            .findOneOrFail({
                id: +userId,
            },
    {
                select: ['id', 'email', 'nickname']
            },
        ).then((user) => {
            done(null, user);
        }).catch((error) => done(error));
    }
}
