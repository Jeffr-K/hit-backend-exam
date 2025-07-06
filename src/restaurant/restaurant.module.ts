import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Menu, Restaurant } from "../entity";
import { RestaurantController } from "./restaurant.controller";
import { RestaurantService } from "./restaurant.service";
import { MenuService } from "./menu.service";
import { User } from "@/entity";

@Module({
  imports: [TypeOrmModule.forFeature([Restaurant, Menu, User])],
  controllers: [RestaurantController],
  providers: [RestaurantService, MenuService]
})
export class RestaurantModule {}
