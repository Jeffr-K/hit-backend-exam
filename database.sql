-- 사용자 테이블
CREATE TABLE user (
    id        INT AUTO_INCREMENT PRIMARY KEY,
    username  VARCHAR(255) NOT NULL,
    password  VARCHAR(255) NOT NULL,
    userType  VARCHAR(255) NOT NULL,
    CONSTRAINT IDX_78a916df40e02a9deb1c4b75ed UNIQUE (username)
);

-- 식당 테이블 (user와 1:1 관계)
CREATE TABLE restaurant (
    id       INT AUTO_INCREMENT PRIMARY KEY,
    name     VARCHAR(255) NOT NULL,
    userId   INT NULL,
    CONSTRAINT REL_43ebcd49fca84c2fda8c077ac6 UNIQUE (userId),
    CONSTRAINT FK_43ebcd49fca84c2fda8c077ac68 FOREIGN KEY (userId) REFERENCES user (id)
);

-- 메뉴 테이블 (restaurant N:1)
CREATE TABLE menu (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    name         VARCHAR(255) NOT NULL,
    price        INT NOT NULL,
    description  TEXT NOT NULL,
    category     VARCHAR(255) NOT NULL,
    restaurantId INT NULL,
    CONSTRAINT FK_085156de3c3a44eba017a6a0846 FOREIGN KEY (restaurantId) REFERENCES restaurant (id)
);

-- 예약 테이블
CREATE TABLE reservation (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    reservationDate DATETIME     NOT NULL,
    startTime       VARCHAR(255) NOT NULL,
    endTime         VARCHAR(255) NOT NULL,
    phoneNumber     VARCHAR(255) NOT NULL,
    headcount       INT NOT NULL,
    restaurantId    INT NULL,
    userId          INT NULL,
    CONSTRAINT FK_2a2d6c09d1469e65c347513256a FOREIGN KEY (restaurantId) REFERENCES restaurant (id),
    CONSTRAINT FK_529dceb01ef681127fef04d755d FOREIGN KEY (userId) REFERENCES user (id)
);

-- 예약-메뉴 다대다 연결 테이블
CREATE TABLE reservation_menus_menu (
    reservationId INT NOT NULL,
    menuId        INT NOT NULL,
    PRIMARY KEY (reservationId, menuId),
    CONSTRAINT FK_3450614b0b68d0109f44cd5d0e3
        FOREIGN KEY (menuId) REFERENCES menu (id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT FK_8a937c2673a60db25a3dd17dc69
        FOREIGN KEY (reservationId) REFERENCES reservation (id)
        ON UPDATE CASCADE ON DELETE CASCADE
);

-- 인덱스
CREATE INDEX IDX_3450614b0b68d0109f44cd5d0e
    ON reservation_menus_menu (menuId);

CREATE INDEX IDX_8a937c2673a60db25a3dd17dc6
    ON reservation_menus_menu (reservationId);
