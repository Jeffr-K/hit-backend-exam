import { Injectable, NotFoundException, UnauthorizedException, ConflictException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { Reservation, User, Restaurant, Menu, UserType } from "../entity";
import { CreateReservationDto, UpdateReservationDto, GetReservationFilterDto } from "@/dtos";
import { Builder } from "builder-pattern";

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
    @InjectRepository(Menu)
    private menuRepository: Repository<Menu>
  ) {}

  async createReservation(createReservationDto: CreateReservationDto, userId: number): Promise<void> {
    const customer = await this.userRepository.findOne({
      where: { id: userId }
    });
    if (!customer) {
      throw new NotFoundException(`Customer with ID "${userId}" not found`);
    }

    const restaurant = await this.restaurantRepository.findOne({
      where: { id: createReservationDto.restaurantId }
    });
    if (!restaurant) {
      throw new NotFoundException(`Restaurant with ID "${createReservationDto.restaurantId}" not found`);
    }

    const menus = await this.menuRepository.findBy({
      id: In(createReservationDto.menuIds)
    });
    if (menus.length !== createReservationDto.menuIds.length) {
      throw new NotFoundException("One or more menus not found.");
    }

    const existingReservation = await this.reservationRepository
      .createQueryBuilder("reservation")
      .innerJoin("reservation.restaurant", "restaurant")
      .where("restaurant.id = :restaurantId", {
        restaurantId: createReservationDto.restaurantId
      })
      .andWhere("reservation.reservationDate = :reservationDate", {
        reservationDate: createReservationDto.reservationDate
      })
      .andWhere("reservation.startTime < :endTime", {
        endTime: createReservationDto.endTime
      })
      .andWhere("reservation.endTime > :startTime", {
        startTime: createReservationDto.startTime
      })
      .getOne();

    if (existingReservation) {
      throw new ConflictException("The requested reservation time conflicts with an existing reservation.");
    }

    const reservation = Builder(Reservation)
      .reservationDate(new Date(createReservationDto.reservationDate))
      .startTime(createReservationDto.startTime)
      .endTime(createReservationDto.endTime)
      .phoneNumber(createReservationDto.phoneNumber)
      .headcount(createReservationDto.headcount)
      .restaurant(restaurant)
      .user(customer)
      .menus(menus)
      .build();

    await this.reservationRepository.save(reservation);
  }

  async updateReservation(id: number, updateReservationDto: UpdateReservationDto, userId: number): Promise<Reservation> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID "${userId}" not found.`);
    }

    const reservation = await this.reservationRepository.findOne({
      where: { id },
      relations: ["user", "restaurant"]
    });
    if (!reservation) {
      throw new NotFoundException(`Reservation with ID "${id}" not found.`);
    }

    if (user.userType !== UserType.CUSTOMER || reservation.user.id !== user.id) {
      throw new UnauthorizedException("You are not authorized to update this reservation.");
    }

    const { reservationDate, startTime, endTime } = updateReservationDto;
    if (reservationDate || startTime || endTime) {
      const checkDate = reservationDate || reservation.reservationDate;
      const checkStartTime = startTime || reservation.startTime;
      const checkEndTime = endTime || reservation.endTime;

      const existingReservation = await this.reservationRepository
        .createQueryBuilder("reservation")
        .where("reservation.id != :id", { id })
        .andWhere("reservation.restaurantId = :restaurantId", {
          restaurantId: reservation.restaurant.id
        })
        .andWhere("reservation.reservationDate = :checkDate", { checkDate })
        .andWhere("reservation.startTime < :checkEndTime", { checkEndTime })
        .andWhere("reservation.endTime > :checkStartTime", { checkStartTime })
        .getOne();

      if (existingReservation) {
        throw new ConflictException("The requested reservation time conflicts with an existing reservation.");
      }
    }

    // Update menus if provided
    if (updateReservationDto.menuIds) {
      const menus = await this.menuRepository.findBy({
        id: In(updateReservationDto.menuIds)
      });
      if (menus.length !== updateReservationDto.menuIds.length) {
        throw new NotFoundException("One or more menus not found.");
      }
      reservation.menus = menus;
      delete updateReservationDto.menuIds;
    }

    Object.assign(reservation, updateReservationDto);
    await this.reservationRepository.save(reservation);
    return reservation;
  }

  async deleteReservation(id: number, user: { userId: number; type: string }): Promise<void> {
    if (user.type !== "customer") {
      throw new UnauthorizedException("Only customers can delete reservations.");
    }

    const result = await this.reservationRepository.delete({
      id,
      user: { id: user.userId }
    });

    if (result.affected === 0) {
      throw new NotFoundException(`Reservation with ID "${id}" not found or you don't have permission to delete it.`);
    }
  }

  async getReservations(filterDto: GetReservationFilterDto, user: { userId: number; type: string }): Promise<Reservation[]> {
    const { reservationDate, phoneNumber, minHeadcount, menuIds } = filterDto;
    const query = this.reservationRepository
      .createQueryBuilder("reservation")
      .leftJoinAndSelect("reservation.user", "user")
      .leftJoinAndSelect("reservation.restaurant", "restaurant")
      .leftJoinAndSelect("reservation.menus", "menu");

    if (user.type === "customer") {
      query.where("reservation.userId = :userId", { userId: user.userId });
    } else if (user.type === "restaurant") {
      query.innerJoin("reservation.restaurant", "rest").where("rest.userId = :userId", { userId: user.userId });
    }

    if (reservationDate) {
      query.andWhere("reservation.reservationDate = :reservationDate", {
        reservationDate
      });
    }

    if (phoneNumber) {
      query.andWhere("reservation.phoneNumber LIKE :phoneNumber", {
        phoneNumber: `%${phoneNumber}%`
      });
    }

    if (minHeadcount) {
      query.andWhere("reservation.headcount >= :minHeadcount", {
        minHeadcount
      });
    }

    if (menuIds && menuIds.length > 0) {
      query.andWhere("menu.id IN (:...menuIds)", { menuIds });
    }

    return query.getMany();
  }
}
