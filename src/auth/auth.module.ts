import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import {PassportModule} from "@nestjs/passport";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Users} from "../entities/user.entity";
import {LocalStrategy} from "./local.strategy";
import {LocalAuthGuard} from "./local-auth.guard";

@Module({
  imports: [
    PassportModule.register({ session: true }),
    TypeOrmModule.forFeature([Users]),
  ],
  providers: [AuthService, LocalStrategy, LocalAuthGuard]
})
export class AuthModule {}
