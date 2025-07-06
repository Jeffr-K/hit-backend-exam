import { Controller, Get, Param, UseGuards, Request, Post, Body } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dtos";
import { ApiResponse } from "@/util/responses";
import { User } from "@/entity";
import { ApiTags, ApiOperation, ApiResponse as ApiSwaggerResponse, ApiBearerAuth } from "@nestjs/swagger";
import { UserResponseDto } from "@/dtos";

@ApiTags("User")
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("/")
  @ApiOperation({ summary: "회원가입", description: "새로운 사용자를 생성합니다." })
  @ApiSwaggerResponse({ status: 201, description: "회원가입 성공", type: UserResponseDto })
  async createUser(@Body() createUserDto: CreateUserDto): Promise<ApiResponse<User>> {
    const user = await this.userService.createUser(createUserDto);
    return ApiResponse.success(user, "회원가입이 성공적으로 완료되었습니다.");
  }

  @Get(":id")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @ApiOperation({ summary: "사용자 정보 조회", description: "ID로 특정 사용자 정보를 조회합니다." })
  @ApiSwaggerResponse({ status: 200, description: "사용자 정보 조회 성공", type: UserResponseDto })
  async getUserById(@Param("id") id: number, @Request() req): Promise<ApiResponse<User>> {
    const user = await this.userService.getUserById(req.user.id);
    return ApiResponse.success(user, "사용자 정보 조회가 성공적으로 완료되었습니다.");
  }
}
