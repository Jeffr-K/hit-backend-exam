import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Restaurant, UserType } from "../entity";
import { CreateRestaurantDto } from "./dtos";
import { Builder } from "builder-pattern";
import { User } from "@/entity";

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async createRestaurant(createRestaurantDto: CreateRestaurantDto, userId: number): Promise<Restaurant> {
    const owner = await this.userRepository.findOne({ where: { id: userId } });
    if (!owner || owner.userType !== UserType.RESTAURANT) {
      throw new BadRequestException("레스토랑을 생성할 수 없습니다.");
    }

    const restaurant = await this.restaurantRepository.findOne({
      where: { name: createRestaurantDto.name }
    });
    if (restaurant) {
      throw new BadRequestException("레스토랑이 이미 존재합니다.");
    }

    const newRestaurant = Builder(Restaurant).name(createRestaurantDto.name).user(owner).build();

    return this.restaurantRepository.save(newRestaurant);
  }

  async deleteRestaurant(restaurantId: number): Promise<void> {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id: restaurantId }
    });
    if (!restaurant) {
      throw new BadRequestException("레스토랑이 존재하지 않습니다.");
    }

    await this.restaurantRepository.remove(restaurant);
  }

  async getRestaurants(): Promise<Restaurant[]> {
    return this.restaurantRepository.find();
  }

  async getRestaurantById(restaurantId: number): Promise<Restaurant> {
    return this.restaurantRepository.findOne({ where: { id: restaurantId } });
  }
}
