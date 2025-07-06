import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne } from "typeorm";
import { Reservation } from "./reservation.entity";
import { Restaurant } from "./restaurant.entity";

export enum UserType {
  CUSTOMER = "customer",
  RESTAURANT = "restaurant"
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  userType: UserType;

  @OneToMany(() => Reservation, (reservation) => reservation.user)
  reservations: Reservation[];

  @OneToOne(() => Restaurant, (restaurant) => restaurant.user)
  restaurant: Restaurant;
}
