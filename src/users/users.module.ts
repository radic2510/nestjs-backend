import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Users} from "../entities/user.entity";
import { DefaultAdminModule, DefaultAdminSite } from 'nestjs-admin';

@Module({
  imports: [
      TypeOrmModule.forFeature([Users]),
      DefaultAdminModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [
      TypeOrmModule,
      UsersService
  ]
})
export class UsersModule {
  constructor(private readonly adminSite: DefaultAdminSite) {
    adminSite.register('Users', Users);
  }
}
