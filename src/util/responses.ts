import { HttpStatus } from "@nestjs/common";

/**
 * @description API 응답을 위한 공통 클래스
 */
export class ApiResponse<T> {
  public readonly success: boolean;
  public readonly statusCode: number;
  public readonly message: string;
  public readonly data: T;

  protected constructor(success: boolean, statusCode: number, message: string, data: T) {
    this.success = success;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }

  /**
   * @description 성공 응답을 생성합니다.
   * @param data 응답 데이터
   * @param message 응답 메시지 (기본값: 'Success')
   * @param statusCode HTTP 상태 코드 (기본값: 200 OK)
   * @returns ApiResponse 인스턴스
   */
  public static success<T>(data: T, message = "Success", statusCode = HttpStatus.OK): ApiResponse<T> {
    return new ApiResponse(true, statusCode, message, data);
  }

  /**
   * @description 실패 응답을 생성합니다.
   * @param message 오류 메시지
   * @param statusCode HTTP 상태 코드 (기본값: 500 Internal Server Error)
   * @param data 추가 오류 데이터 (기본값: null)
   * @returns ApiResponse 인스턴스
   */
  public static error<T>(message: string, statusCode = HttpStatus.INTERNAL_SERVER_ERROR, data: T = null): ApiResponse<T> {
    return new ApiResponse(false, statusCode, message, data);
  }
}
