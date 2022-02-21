import { ApiProperty, ApiTags } from "@nestjs/swagger";

@ApiTags('USERS')
export class CreateUserDto {
    @ApiProperty({
        example: 'test@test.com',
        description: '이메일',
        required: true
    })
    public email: string;

    @ApiProperty({
        example: '테스터',
        description: '닉네임',
        required: true
    })
    public nickname: string;

    @ApiProperty({
        example: 'password!!',
        description: '패스워드',
        required: true
    })
    public password: string;
}
