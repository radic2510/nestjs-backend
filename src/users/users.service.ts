import {ForbiddenException, Injectable} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {Connection, Repository} from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Users } from "../entities/user.entity";
import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
      @InjectRepository(Users) private usersRepository: Repository<Users>,
      private connection: Connection
  ) {}

  async create(createUserDto: CreateUserDto) {
    const qr = this.connection.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();

    // 중복 가입 방지
    const email = createUserDto.email;
    const user = await qr.manager
        .getRepository(Users)
        .findOne({ where: { email }});
    if (user) {
      throw new ForbiddenException('이미 존재하는 사용자입니다');
    }

    // 비밀번호 암호화(bcrypt)
    const hashedPassword = await bcrypt.hash(createUserDto.password, 12);

    try {
      const returned = await qr.manager.getRepository(Users).save({
        email,
        password: hashedPassword,
      });

      // console.log(returned.id)  // saved users.id

      await qr.commitTransaction();
      return true;
    } catch (error) {
      await qr.rollbackTransaction();
      throw error;
    } finally {
      await qr.release();
    }
  }

  async findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async update(updateUserDto: UpdateUserDto) {
    return `This action updates a #${UpdateUserDto.name}`;
  }

  async remove(user: Users) {
    return `This action removes a #${user.id} user`;
  }

  async findByEmail(email: string) {
    return this.usersRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password'],
    });
  }
}
