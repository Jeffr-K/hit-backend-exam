import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Reservation, User, Restaurant, Menu } from "../entity";
import { ReservationController } from "./reservation.controller";
import { ReservationService } from "./reservation.service";

@Module({
  imports: [TypeOrmModule.forFeature([Reservation, User, Restaurant, Menu])],
  controllers: [ReservationController],
  providers: [ReservationService]
})
export class ReservationModule {}
