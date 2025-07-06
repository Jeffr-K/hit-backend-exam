import { Controller, Post, Body, ValidationPipe } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto, LoginResponseDto } from "@/dtos";
import { ApiResponse } from "@/util/responses";
import { ApiTags, ApiOperation, ApiResponse as ApiSwaggerResponse } from "@nestjs/swagger";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @ApiOperation({ summary: "로그인", description: "사용자 아이디와 비밀번호로 로그인하여 JWT 토큰을 발급받습니다." })
  @ApiSwaggerResponse({ status: 200, description: "로그인 성공", type: LoginResponseDto })
  @ApiSwaggerResponse({ status: 401, description: "인증 정보가 유효하지 않습니다." })
  async login(@Body(ValidationPipe) loginDto: LoginDto): Promise<ApiResponse<{ accessToken: string }>> {
    const result = await this.authService.login(loginDto);
    return ApiResponse.success(result, "로그인에 성공했습니다.");
  }
}
