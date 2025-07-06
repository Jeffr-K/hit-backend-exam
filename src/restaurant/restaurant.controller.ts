import { Controller, Post, Body, UseGuards, Request, Get, Query, Delete, Param, ValidationPipe, ParseIntPipe, ForbiddenException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { RestaurantService } from "./restaurant.service";
import { CreateMenuDto, GetMenuFilterDto, SingleRestaurantResponseDto, MultipleRestaurantsResponseDto, SingleMenuResponseDto, MultipleMenusResponseDto, NullResponseDto } from "@/dtos";
import { MenuService } from "./menu.service";
import { CreateRestaurantDto } from "./dtos";
import { ApiResponse } from "@/util/responses";
import { Restaurant } from "@/entity";
import { UserType } from "@/entity";
import { ApiTags, ApiOperation, ApiResponse as ApiSwaggerResponse, ApiBearerAuth } from "@nestjs/swagger";
import { checkUserType } from '@/util/utilFunction';

@ApiTags("Restaurant")
@ApiBearerAuth()
@Controller("restaurant")
export class RestaurantController {
  constructor(private restaurantService: RestaurantService, private menuService: MenuService) {}

  @Post()
  @UseGuards(AuthGuard("jwt"))
  @ApiOperation({ summary: "레스토랑 생성", description: "새로운 레스토랑을 생성합니다." })
  @ApiSwaggerResponse({ status: 201, description: "레스토랑 생성 성공", type: SingleRestaurantResponseDto })
  async createRestaurant(@Body(ValidationPipe) createRestaurantDto: CreateRestaurantDto, @Request() req): Promise<ApiResponse<Restaurant>> {
    const restaurant = await this.restaurantService.createRestaurant(createRestaurantDto, req.user.userId);
    return ApiResponse.success(restaurant, "레스토랑이 성공적으로 생성되었습니다.");
  }

  @Delete(":id")
  @UseGuards(AuthGuard("jwt"))
  @ApiOperation({ summary: "레스토랑 삭제", description: "레스토랑을 삭제합니다." })
  @ApiSwaggerResponse({ status: 200, description: "레스토랑 삭제 성공", type: NullResponseDto })
  async deleteRestaurant(@Param("id") restaurantId: number): Promise<ApiResponse<null>> {
    await this.restaurantService.deleteRestaurant(restaurantId);
    return ApiResponse.success(null, "레스토랑이 성공적으로 삭제되었습니다.");
  }

  @Get("/list")
  @UseGuards(AuthGuard("jwt"))
  @ApiOperation({ summary: "레스토랑 목록 조회", description: "모든 레스토랑 목록을 조회합니다." })
  @ApiSwaggerResponse({ status: 200, description: "레스토랑 목록 조회 성공", type: MultipleRestaurantsResponseDto })
  async getRestaurants(): Promise<ApiResponse<Restaurant[]>> {
    const restaurants = await this.restaurantService.getRestaurants();
    return ApiResponse.success(restaurants, "레스토랑 목록 조회가 성공적으로 완료되었습니다.");
  }

  @Get(":id")
  @UseGuards(AuthGuard("jwt"))
  @ApiOperation({ summary: "레스토랑 상세 조회", description: "특정 레스토랑의 상세 정보를 조회합니다." })
  @ApiSwaggerResponse({ status: 200, description: "레스토랑 상세 조회 성공", type: SingleRestaurantResponseDto })
  async getRestaurantById(@Param("id") id: number): Promise<ApiResponse<Restaurant>> {
    const restaurant = await this.restaurantService.getRestaurantById(id);
    return ApiResponse.success(restaurant, "레스토랑 상세 정보 조회가 성공적으로 완료되었습니다.");
  }

  @Post("menu")
  @UseGuards(AuthGuard("jwt"))
  @ApiOperation({ summary: "메뉴 생성", description: "레스토랑에 새로운 메뉴를 생성합니다." })
  @ApiSwaggerResponse({ status: 201, description: "메뉴 생성 성공", type: SingleMenuResponseDto })
  @ApiSwaggerResponse({ status: 403, description: "권한이 없습니다." })
  async createMenu(@Body(ValidationPipe) createMenuDto: CreateMenuDto, @Request() req): Promise<ApiResponse<any>> {
    checkUserType(req.user, [UserType.RESTAURANT]);

    const menu = await this.menuService.createMenu(createMenuDto);
    return ApiResponse.success(menu, "메뉴가 성공적으로 생성되었습니다.");
  }

  @Delete("/:restaurantId/menu/:menuId")
  @UseGuards(AuthGuard("jwt"))
  @ApiOperation({ summary: "메뉴 삭제", description: "레스토랑의 메뉴를 삭제합니다." })
  @ApiSwaggerResponse({ status: 200, description: "메뉴 삭제 성공", type: NullResponseDto })
  @ApiSwaggerResponse({ status: 403, description: "권한이 없습니다." })
  async deleteMenu(@Param("menuId", ParseIntPipe) menuId: number, @Param("restaurantId", ParseIntPipe) restaurantId: number, @Request() req): Promise<ApiResponse<null>> {
    checkUserType(req.user, [UserType.RESTAURANT]);
    await this.menuService.deleteMenu(menuId, restaurantId);
    return ApiResponse.success(null, "메뉴가 성공적으로 삭제되었습니다.");
  }

  @Get("/:restaurantId/menu")
  @UseGuards(AuthGuard("jwt"))
  @ApiOperation({ summary: "메뉴 목록 조회", description: "레스토랑의 메뉴 목록을 조회합니다." })
  @ApiSwaggerResponse({ status: 200, description: "메뉴 목록 조회 성공", type: MultipleMenusResponseDto })
  @ApiSwaggerResponse({ status: 403, description: "권한이 없습니다." })
  async getMenus(
    @Param("restaurantId", ParseIntPipe) restaurantId: number,
    @Query(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true
      })
    )
    filterDto: GetMenuFilterDto,
    @Request() req: any
  ): Promise<ApiResponse<any>> {
    if (req.user.userType !== UserType.RESTAURANT) {
      throw new ForbiddenException("메뉴를 조회할 수 있는 권한이 없습니다.");
    }

    const menus = await this.menuService.getMenus(restaurantId, filterDto);
    return ApiResponse.success(menus, "메뉴 목록 조회가 성공적으로 완료되었습니다.");
  }
}
