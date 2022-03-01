import { ApiProperty, ApiTags } from "@nestjs/swagger";
import {IsEmail, IsNotEmpty, IsString} from "class-validator";

@ApiTags('USERS')
export class CreateUserDto {
    @IsEmail()
    @ApiProperty({
        example: 'test@test.com',
        description: '이메일',
        required: true
    })
    public email: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: '테스터',
        description: '닉네임',
        required: true
    })
    public nickname: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: 'password!!',
        description: '패스워드',
        required: true
    })
    public password: string;
}
