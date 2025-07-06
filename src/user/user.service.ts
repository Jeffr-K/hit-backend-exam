import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../entity";
import { Builder } from "builder-pattern";
import { CreateUserDto } from "./dtos";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const user = await this.userRepository.findOne({
      where: { username: createUserDto.username }
    });
    console.log("user", user);
    if (user) {
      throw new BadRequestException("User already exists");
    }

    console.log("user created", createUserDto);

    const newUser = Builder(User).username(createUserDto.username).password(createUserDto.password).userType(createUserDto.userType).build();

    return await this.userRepository.save(newUser);
  }

  async getUserById(id: number): Promise<User> {
    const customer = await this.userRepository.findOne({
      where: { id },
      relations: ["reservations", "reservations.restaurant", "reservations.menus"]
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID "${id}" not found`);
    }

    delete customer.password;
    return customer;
  }
}
