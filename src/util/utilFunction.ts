import { ForbiddenException } from "@nestjs/common";
import { UserType } from "../entity";

export function checkUserType(user: any, allowedTypes: UserType[]): void {
  if (!user || !allowedTypes.includes(user.userType)) {
    throw new ForbiddenException("권한이 없습니다.");
  }
}

