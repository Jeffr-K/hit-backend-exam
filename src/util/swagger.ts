import { INestApplication } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

/**
 * Swagger UI를 설정하고 초기화합니다.
 * @param app NestJS Application
 */
export function setupSwagger(app: INestApplication): void {
  const options = new DocumentBuilder()
    .setTitle("HIT-BACKEND-EXAM API Docs")
    .setDescription("에이치 아이티의 레스토랑 예약 시스템 API 문서")
    .setVersion("1.0.0")
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("api-docs", app, document);
}
