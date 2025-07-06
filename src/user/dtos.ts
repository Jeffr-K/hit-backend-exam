import { UserType } from "../entity";
import { IsNotEmpty, IsString, IsEnum } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty({ description: '사용자 아이디', example: 'new_customer' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ description: '비밀번호', example: 'password123' })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({ description: '사용자 타입', enum: UserType, example: UserType.CUSTOMER })
  @IsNotEmpty()
  @IsEnum(UserType)
  userType: UserType;
}
