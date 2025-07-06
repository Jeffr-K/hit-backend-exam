import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from "typeorm";
import { Restaurant } from "./restaurant.entity";
import { User } from "./user.entity";
import { Menu } from "./menu.entity";

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  reservationDate: Date;

  @Column()
  startTime: string;

  @Column()
  endTime: string;

  @Column()
  phoneNumber: string;

  @Column()
  headcount: number;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.reservations)
  restaurant: Restaurant;

  @ManyToOne(() => User, (user) => user.reservations)
  user: User;

  @ManyToMany(() => Menu)
  @JoinTable()
  menus: Menu[];
}
