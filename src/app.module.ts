import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { TypeOrmConfigService } from "./util/typeorm";
import { AuthModule } from "./auth/auth.module";
import { RestaurantModule } from "./restaurant/restaurant.module";
import { UserModule } from "./user/user.module";
import { ReservationModule } from "./reservation/reservation.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService
    }),
    AuthModule,
    RestaurantModule,
    UserModule,
    ReservationModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
