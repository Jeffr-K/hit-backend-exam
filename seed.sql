-- 사용자 계정 (식당 2, 고객 3)
INSERT INTO user (id, username, password, userType) VALUES
(1, 'resto1', 'test1234', 'restaurant'),
(2, 'resto2', 'test1234', 'restaurant'),
(3, 'user1',  'test1234', 'user'),
(4, 'user2',  'test1234', 'user'),
(5, 'user3',  'test1234', 'user');

-- 식당 정보 (user와 1:1 연결)
INSERT INTO restaurant (id, name, userId) VALUES
(1, '파스타킹',   1),
(2, '스시마스터', 2);

-- 메뉴 데이터 (enum 카테고리 반영)
INSERT INTO menu (id, name, price, description, category, restaurantId) VALUES
(1, '김치찌개',    8000,  '매콤한 김치찌개',         'KOREAN',   1),
(2, '짜장면',      7000,  '달콤 짭짤한 짜장면',     'CHINESE',  1),
(3, '초밥세트',    15000, '신선한 초밥 모듬',        'JAPANESE', 2),
(4, '라멘',        12000, '진한 돈코츠 라멘',        'JAPANESE', 2);

-- 예약 데이터 (user1 → 파스타킹에 예약)
INSERT INTO reservation (
    id, reservationDate, startTime, endTime, phoneNumber, headcount, restaurantId, userId
) VALUES (
    1, '2025-07-10', '18:00', '19:00', '010-1234-5678', 2, 1, 3
);

-- 예약-메뉴 관계 (user1이 메뉴 2개 선택)
INSERT INTO reservation_menus_menu (reservationId, menuId) VALUES
(1, 1),
(1, 2);
