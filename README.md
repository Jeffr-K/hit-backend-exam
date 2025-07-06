# 🍽️ Node.js 채용 미션 - 식당 예약 시스템 API

NestJS 기반의 식당 예약 시스템 API 서버입니다.  
고객과 식당 간 예약 흐름을 체험할 수 있도록 구성되어 있으며, TypeORM + MySQL 기반으로 DB를 설계하였습니다.

---

## 📦 배포

App: https://hit-backend-exam.onrender.com

Swagger: https://hit-backend-exam.onrender.com/api-docs

## 📌 프로젝트 개요

- **개발 스택**: `NestJS`, `TypeORM`, `MySQL`, `JWT`, `Swagger`
- **DB 설계**: [database.sql](./database.sql) 포함
- **배포 링크**: `https://your-swagger-url.com`
- **테스트 계정 정보**:
  - 🍴 식당  
    - `loginId: resto1`, `password: test1234`  
    - `loginId: resto2`, `password: test1234`  
  - 👤 고객  
    - `username: user1`, `password: test1234`  
    - `username: user2`, `password: test1234`  
    - `username: user3`, `password: test1234`  

---

## 🧱 데이터베이스 설계


- `restaurant`, `menu`, `user`, `reservation`, `reservation_menus_menu` 테이블 등으로 구성  
- ERD 및 테이블 구조는 `database.sql` 참고

```sql
-- 예시: restaurant 테이블 일부
CREATE TABLE restaurant (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT UNIQUE,
    name VARCHAR(255) NOT NULL,
    CONSTRAINT FK_user FOREIGN KEY (userId) REFERENCES user(id)
);
```

## 프로젝트 구조

src/
├── entity/
├── restaurant/
│   ├── dtos.ts
│   ├── forms.ts
│   ├── enums.ts
│   ├── restaurant.controller.ts
│   ├── restaurant.service.ts
│   └── restaurant.module.ts
├── user/
│   ├── dtos.ts
│   ├── forms.ts
│   ├── user.controller.ts
│   ├── user.service.ts
│   └── user.module.ts
├── util/
│   ├── typeorm.ts
│   ├── swagger.ts
│   ├── responses.ts
│   └── valider.ts
├── app.module.ts
└── main.ts
