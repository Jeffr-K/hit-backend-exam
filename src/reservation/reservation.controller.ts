import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Param,
  Query,
  UseGuards,
  Request,
  ValidationPipe,
  ParseIntPipe,
  Put
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ReservationService } from "./reservation.service";
import { CreateReservationDto, UpdateReservationDto, GetReservationFilterDto, SingleReservationResponseDto, MultipleReservationsResponseDto, NullResponseDto } from "@/dtos";
import { ApiResponse } from "@/util/responses";
import { UserType } from "@/entity";
import { ApiTags, ApiOperation, ApiResponse as ApiSwaggerResponse, ApiBearerAuth } from "@nestjs/swagger";
import { checkUserType } from '@/util/utilFunction';

@ApiTags("Reservation")
@ApiBearerAuth()
@Controller("reservation")
export class ReservationController {
  constructor(private reservationService: ReservationService) {}

  @Post()
  @UseGuards(AuthGuard("jwt"))
  @ApiOperation({ summary: "예약 생성", description: "고객이 레스토랑에 예약을 생성합니다." })
  @ApiSwaggerResponse({ status: 201, description: "예약 생성 성공", type: SingleReservationResponseDto })
  @ApiSwaggerResponse({ status: 403, description: "권한이 없습니다." })
  async createReservation(@Body(ValidationPipe) createReservationDto: CreateReservationDto, @Request() req: any): Promise<ApiResponse<any>> {
    checkUserType(req.user, [UserType.CUSTOMER]);
    const reservation = await this.reservationService.createReservation(createReservationDto, req.user.userId);
    return ApiResponse.success(reservation, "예약이 성공적으로 생성되었습니다.");
  }

  @Get()
  @UseGuards(AuthGuard("jwt"))
  @ApiOperation({ summary: "예약 조회", description: "고객 또는 레스토랑이 예약을 조회합니다." })
  @ApiSwaggerResponse({ status: 200, description: "예약 조회 성공", type: MultipleReservationsResponseDto })
  @ApiSwaggerResponse({ status: 403, description: "권한이 없습니다." })
  async getReservations(
    @Query(new ValidationPipe({ transform: true, transformOptions: { enableImplicitConversion: true } })) filterDto: GetReservationFilterDto,
    @Request() req: any
  ): Promise<ApiResponse<any>> {
    checkUserType(req.user, [UserType.CUSTOMER, UserType.RESTAURANT]);

    const userInfo = {
      userId: req.user.userId,
      type: req.user.userType === UserType.CUSTOMER ? "customer" : "restaurant"
    };

    const reservations = await this.reservationService.getReservations(filterDto, userInfo);
    return ApiResponse.success(reservations, "예약 조회가 성공적으로 완료되었습니다.");
  }

  @Put(":id")
  @UseGuards(AuthGuard("jwt"))
  @ApiOperation({ summary: "예약 수정", description: "고객이 예약을 수정합니다." })
  @ApiSwaggerResponse({ status: 200, description: "예약 수정 성공", type: SingleReservationResponseDto })
  @ApiSwaggerResponse({ status: 403, description: "권한이 없습니다." })
  async updateReservation(
    @Param("id", ParseIntPipe) id: number,
    @Body(ValidationPipe) updateReservationDto: UpdateReservationDto,
    @Request() req: any
  ): Promise<ApiResponse<any>> {
    checkUserType(req.user, [UserType.CUSTOMER]);
    const updatedReservation = await this.reservationService.updateReservation(id, updateReservationDto, req.user.userId);
    return ApiResponse.success(updatedReservation, "예약이 성공적으로 수정되었습니다.");
  }

  @Delete(":reservationId")
  @UseGuards(AuthGuard("jwt"))
  @ApiOperation({ summary: "예약 삭제", description: "고객이 예약을 삭제합니다." })
  @ApiSwaggerResponse({ status: 200, description: "예약 삭제 성공", type: NullResponseDto })
  @ApiSwaggerResponse({ status: 403, description: "권한이 없습니다." })
  async deleteReservation(@Param("reservationId", ParseIntPipe) reservationId: number, @Request() req: any): Promise<ApiResponse<null>> {
    checkUserType(req.user, [UserType.CUSTOMER]);

    await this.reservationService.deleteReservation(reservationId, { userId: req.user.userId, type: req.user.userType });
    return ApiResponse.success(null, "예약이 성공적으로 삭제되었습니다.");
  }
}
