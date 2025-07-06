import { BadRequestException, ForbiddenException, Injectable } from "@nestjs/common";
import { CreateMenuDto } from "@/dtos";
import { Menu } from "../entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { GetMenuFilterDto } from "@/dtos";
import { Restaurant } from "../entity";
import { NotFoundException } from "@nestjs/common";
import { Builder } from "builder-pattern";

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu) private menuRepository: Repository<Menu>,
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>
  ) {}

  async getMenus(restaurantId: number, filterDto: GetMenuFilterDto): Promise<Menu[]> {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id: restaurantId }
    });

    if (!restaurant) {
      throw new NotFoundException(`레스토랑 "${restaurantId}"를 찾을 수 없습니다.`);
    }

    const queryBuilder = this.menuRepository
      .createQueryBuilder("menu")
      .leftJoinAndSelect("menu.restaurant", "restaurant")
      .where("restaurant.id = :restaurantId", { restaurantId });

    if (filterDto.name) {
      queryBuilder.andWhere("menu.name LIKE :name", {
        name: `%${filterDto.name}%`
      });
    }

    if (filterDto.minPrice !== undefined) {
      queryBuilder.andWhere("menu.price >= :minPrice", {
        minPrice: filterDto.minPrice
      });
    }

    if (filterDto.maxPrice !== undefined) {
      queryBuilder.andWhere("menu.price <= :maxPrice", {
        maxPrice: filterDto.maxPrice
      });
    }

    if (filterDto.category) {
      queryBuilder.andWhere("menu.category = :category", {
        category: filterDto.category
      });
    }

    queryBuilder.orderBy("menu.name", "ASC");

    const menus = await queryBuilder.getMany();

    return menus;
  }

  async createMenu(createMenuDto: CreateMenuDto): Promise<Menu> {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id: createMenuDto.restaurantId }
    });
    if (!restaurant) {
      throw new NotFoundException(`Restaurant with ID "${createMenuDto.restaurantId}" not found`);
    }

    const menu = Builder(Menu)
      .name(createMenuDto.name)
      .price(createMenuDto.price)
      .description(createMenuDto.description)
      .category(createMenuDto.menuCategory)
      .restaurant(restaurant)
      .build();

    const savedMenu = await this.menuRepository.save(menu);
    return savedMenu;
  }

  async deleteMenu(menuId: number, restaurantId: number): Promise<void> {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id: restaurantId }
    });

    if (!restaurant) {
      throw new NotFoundException(`레스토랑 "${restaurantId}"를 찾을 수 없습니다.`);
    }

    const menu = await this.menuRepository.findOne({
      where: { id: menuId },
      relations: ["restaurant"]
    });

    if (!menu) {
      throw new NotFoundException(`메뉴 "${menuId}"를 찾을 수 없습니다.`);
    }

    console.log("menu", menu);
    console.log("restaurantId", restaurantId);

    if (menu.restaurant.id !== restaurantId) {
      throw new BadRequestException(`레스토랑 "${restaurantId}"에 소속된 메뉴가 아닙니다.`);
    }

    await this.menuRepository.remove(menu);
  }
}
