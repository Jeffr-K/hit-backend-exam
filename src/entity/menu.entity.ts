import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Restaurant } from "./restaurant.entity";

export enum MenuCategory {
  KOREAN = "KOREAN",
  CHINESE = "CHINESE",
  JAPANESE = "JAPANESE"
}

@Entity()
export class Menu {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column("text")
  description: string;

  @Column()
  category: MenuCategory;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.menus)
  restaurant: Restaurant;
}
