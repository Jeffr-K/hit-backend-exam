import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsOptional,
  IsDateString,
  IsPhoneNumber,
  IsInt,
  Min,
  IsArray,
  ArrayNotEmpty,
  Matches,
  MinLength
} from "class-validator";
import { MenuCategory, UserType } from "./entity";
import { Transform, Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { ApiResponse } from "./util/responses";

export class LoginDto {
  @ApiProperty({ description: '사용자 아이디', example: 'customer1' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: '비밀번호', example: 'customer1' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class CreateMenuDto {
  @ApiProperty({ description: '메뉴 이름', example: '된장찌개' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: '메뉴 설명', example: '구수한 시골 된장으로 끓인 찌개' })
  @IsString()
  description: string;

  @ApiProperty({ description: '가격', example: 8000 })
  @IsNumber()
  price: number;

  @ApiProperty({ description: '메뉴 카테고리', enum: MenuCategory, example: MenuCategory.KOREAN })
  @IsNotEmpty()
  @IsEnum(MenuCategory)
  menuCategory: MenuCategory;

  @ApiProperty({ description: '레스토랑 ID', example: 1 })
  @IsNumber()
  restaurantId: number;
}

export class GetMenuFilterDto {
  @ApiProperty({ description: '메뉴 이름 검색', required: false, example: '된장' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: '최소 가격', required: false, example: 5000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  minPrice?: number;

  @ApiProperty({ description: '최대 가격', required: false, example: 10000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  maxPrice?: number;

  @ApiProperty({ description: '메뉴 카테고리', enum: MenuCategory, required: false, example: MenuCategory.KOREAN })
  @IsOptional()
  @IsEnum(MenuCategory, {
    message: `카테고리는 다음 중 하나여야 합니다: ${Object.values(MenuCategory).join(", ")}`
  })
  category?: MenuCategory;
}

export class CreateReservationDto {
  @ApiProperty({ description: '레스토랑 ID', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  restaurantId: number;

  @ApiProperty({ description: '예약 날짜', example: '2025-07-05' })
  @IsNotEmpty()
  @IsDateString()
  reservationDate: string;

  @ApiProperty({ description: '예약 시작 시간', example: '18:00' })
  @IsNotEmpty()
  @IsString()
  startTime: string;

  @ApiProperty({ description: '예약 종료 시간', example: '20:00' })
  @IsNotEmpty()
  @IsString()
  endTime: string;

  @ApiProperty({ description: '예약자 휴대폰 번호', example: '010-1234-5678' })
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @ApiProperty({ description: '예약 인원', example: 4 })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  headcount: number;

  @ApiProperty({ description: '주문 메뉴 ID 목록', type: [Number], example: [1, 2] })
  @IsNotEmpty()
  @IsArray()
  @Type(() => Number)
  menuIds: number[];
}

export class UpdateReservationDto {
  @ApiProperty({ description: '변경할 예약 인원', required: false, example: 5 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  headcount?: number;

  @ApiProperty({ description: '변경할 메뉴 ID 목록', type: [Number], required: false, example: [3] })
  @IsOptional()
  @IsArray()
  @Type(() => Number)
  menuIds?: number[];

  @ApiProperty({ description: '변경할 예약 날짜', required: false, example: '2025-07-06' })
  @IsOptional()
  @IsDateString()
  reservationDate?: string;

  @ApiProperty({ description: '변경할 예약 시작 시간', required: false, example: '19:00' })
  @IsOptional()
  @IsString()
  startTime?: string;

  @ApiProperty({ description: '변경할 예약 종료 시간', required: false, example: '21:00' })
  @IsOptional()
  @IsString()
  endTime?: string;
}

export class GetReservationFilterDto {
  @ApiProperty({ description: '예약자 휴대폰 번호', required: false, example: '010-1234-5678' })
  @IsOptional()
  @IsString()
  @Matches(/^010-\d{4}/, {
    message: "휴대폰 번호는 010-xxxx 형식으로 최소 8자리 이상 입력해주세요."
  })
  @MinLength(8, {
    message: "휴대폰 번호는 최소 8자리 이상 입력해주세요. (예: 010-1234)"
  })
  phoneNumber?: string;

  @ApiProperty({ description: '예약 날짜', required: false, example: '2025-07-05' })
  @IsOptional()
  @IsDateString()
  reservationDate?: string;

  @ApiProperty({ description: '최소 예약 인원', required: false, example: 2 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  minHeadcount?: number;

  @ApiProperty({ description: '검색할 메뉴 ID 목록 (쉼표로 구분)', required: false, example: '1,2' })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === "string") {
      return value.split(",").map((id) => parseInt(id, 10));
    }
    return value;
  })
  @IsArray()
  menuIds?: number[];
}

// --- Auth --- //
class LoginResponseDataDto {
  @ApiProperty({ 
    description: 'JWT 액세스 토큰', 
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImN1c3RvbWVyMSIsImlhdCI6MTYxNjQ2ODQwMCwiZXhwIjoxNjE2NDcyMDAwfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' 
  })
  accessToken: string;
}

export class LoginResponseDto extends ApiResponse<LoginResponseDataDto> {
  @ApiProperty({ type: LoginResponseDataDto })
  data: LoginResponseDataDto;
}

// --- Reservation --- //
class ReservationDataDto {
  @ApiProperty({ description: '예약 ID', example: 1 })
  id: number;

  @ApiProperty({ description: '예약 시간', example: '2023-10-31T19:00:00.000Z' })
  reservationTime: Date;

  @ApiProperty({ description: '예약 인원', example: 4 })
  numberOfGuests: number;

  @ApiProperty({ description: '예약 상태', example: 'pending' })
  status: string;

  @ApiProperty({ description: '고객 ID', example: 1 })
  customerId: number;

  @ApiProperty({ description: '레스토랑 ID', example: 1 })
  restaurantId: number;
}

export class SingleReservationResponseDto extends ApiResponse<ReservationDataDto> {
  @ApiProperty({ type: ReservationDataDto })
  data: ReservationDataDto;
}

export class MultipleReservationsResponseDto extends ApiResponse<ReservationDataDto[]> {
  @ApiProperty({ type: [ReservationDataDto] })
  data: ReservationDataDto[];
}

export class NullResponseDto extends ApiResponse<null> {
  @ApiProperty({ type: 'null', example: null })
  data: null;
}

// --- Restaurant --- //
class RestaurantDataDto {
  @ApiProperty({ description: '레스토랑 ID', example: 1 })
  id: number;

  @ApiProperty({ description: '레스토랑 이름', example: '백년식당' })
  name: string;

  @ApiProperty({ description: '레스토랑 주소', example: '서울시 강남구' })
  address: string;

  @ApiProperty({ description: '사장님 ID', example: 2 })
  ownerId: number;
}

export class SingleRestaurantResponseDto extends ApiResponse<RestaurantDataDto> {
  @ApiProperty({ type: RestaurantDataDto })
  data: RestaurantDataDto;
}

export class MultipleRestaurantsResponseDto extends ApiResponse<RestaurantDataDto[]> {
  @ApiProperty({ type: [RestaurantDataDto] })
  data: RestaurantDataDto[];
}

// --- Menu --- //
class MenuDataDto {
  @ApiProperty({ description: '메뉴 ID', example: 1 })
  id: number;

  @ApiProperty({ description: '메뉴 이름', example: '김치찌개' })
  name: string;

  @ApiProperty({ description: '가격', example: 9000 })
  price: number;

  @ApiProperty({ description: '메뉴 설명', example: '돼지고기가 들어간' })
  description: string;

  @ApiProperty({ description: '메뉴 카테고리', enum: MenuCategory, example: MenuCategory.KOREAN })
  category: MenuCategory;

  @ApiProperty({ description: '레스토랑 ID', example: 1 })
  restaurantId: number;
}

export class SingleMenuResponseDto extends ApiResponse<MenuDataDto> {
  @ApiProperty({ type: MenuDataDto })
  data: MenuDataDto;
}

export class MultipleMenusResponseDto extends ApiResponse<MenuDataDto[]> {
  @ApiProperty({ type: [MenuDataDto] })
  data: MenuDataDto[];
}

// --- User --- //
class UserDataDto {
  @ApiProperty({ description: '사용자 ID', example: 1 })
  id: number;

  @ApiProperty({ description: '사용자 아이디', example: 'customer1' })
  username: string;

  @ApiProperty({ description: '사용자 타입', enum: UserType, example: UserType.CUSTOMER })
  userType: UserType;
}

export class UserResponseDto extends ApiResponse<UserDataDto> {
  @ApiProperty({ type: UserDataDto })
  data: UserDataDto;
}
