import { IsOptional, IsString, IsNumber, IsNotEmpty, IsEnum } from "class-validator";
import { MenuCategory } from "../entity";
import { ApiProperty } from "@nestjs/swagger";

export class CreateRestaurantDto {
  @ApiProperty({ description: '레스토랑 이름', example: '백년식당' })
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class GetMenuFilterDto {
  @ApiProperty({ description: '메뉴 이름', required: false, example: '김치찌개' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: '가격', required: false, example: 9000 })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiProperty({ description: '메뉴 설명', required: false, example: '돼지고기가 들어간' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: '메뉴 카테고리', enum: MenuCategory, required: false, example: MenuCategory.KOREAN })
  @IsOptional()
  @IsEnum(MenuCategory)
  menuCategory?: MenuCategory;
}
