INSERT INTO
    books (
        title,
        form,
        isbn,
        summary,
        detail,
        author,
        pages,
        contents,
        price,
        pub_date
    )
VALUES (
        "어린왕자들",
        "종이책",
        0,
        "어리다..",
        "많이 어리다..",
        "김어림",
        100,
        "목차입니다.",
        20000,
        "2019-01-01"
    );

INSERT INTO
    books (
        title,
        form,
        isbn,
        summary,
        detail,
        author,
        pages,
        contents,
        price,
        pub_date
    )
VALUES (
        "신데렐라들",
        "종이책",
        1,
        "유리구두..",
        "투명한 유리구두..",
        "김구두",
        100,
        "목차입니다.",
        20000,
        "2023-12-01"
    );

INSERT INTO
    books (
        title,
        form,
        isbn,
        summary,
        detail,
        author,
        pages,
        contents,
        price,
        pub_date
    )
VALUES (
        "백설공주들",
        "종이책",
        2,
        "사과..",
        "빨간 사과..",
        "김사과",
        100,
        "목차입니다.",
        20000,
        "2023-11-01"
    );

INSERT INTO
    books (
        title,
        form,
        isbn,
        summary,
        detail,
        author,
        pages,
        contents,
        price,
        pub_date
    )
VALUES (
        "흥부와 놀부들",
        "종이책",
        3,
        "제비..",
        "까만 제비..",
        "김제비",
        100,
        "목차입니다.",
        20000,
        "2023-12-08"
    );

INSERT INTO
    books (
        title,
        img,
        category_id,
        form,
        isbn,
        summary,
        detail,
        author,
        pages,
        contents,
        price,
        pub_date
    )
VALUES (
        "콩쥐 팥쥐",
        4,
        0,
        "ebook",
        4,
        "콩팥..",
        "콩심은데 콩나고..",
        "김콩팥",
        100,
        "목차입니다.",
        20000,
        "2023-12-07"
    );

INSERT INTO
    books (
        title,
        img,
        category_id,
        form,
        isbn,
        summary,
        detail,
        author,
        pages,
        contents,
        price,
        pub_date
    )
VALUES (
        "용궁에 간 토끼",
        5,
        1,
        "종이책",
        5,
        "깡충..",
        "용왕님 하이..",
        "김거북",
        100,
        "목차입니다.",
        20000,
        "2023-10-01"
    );

INSERT INTO
    books (
        title,
        img,
        category_id,
        form,
        isbn,
        summary,
        detail,
        author,
        pages,
        contents,
        price,
        pub_date
    )
VALUES (
        "해님달님",
        15,
        2,
        "ebook",
        6,
        "동앗줄..",
        "황금 동앗줄..!",
        "김해님",
        100,
        "목차입니다.",
        20000,
        "2023-07-16"
    );

INSERT INTO
    books (
        title,
        img,
        category_id,
        form,
        isbn,
        summary,
        detail,
        author,
        pages,
        contents,
        price,
        pub_date
    )
VALUES (
        "장화홍련전",
        80,
        0,
        "ebook",
        7,
        "기억이 안나요..",
        "장화와 홍련이?..",
        "김장화",
        100,
        "목차입니다.",
        20000,
        "2023-03-01"
    );

INSERT INTO
    books (
        title,
        img,
        category_id,
        form,
        isbn,
        summary,
        detail,
        author,
        pages,
        contents,
        price,
        pub_date
    )
VALUES (
        "견우와 직녀",
        8,
        1,
        "ebook",
        8,
        "오작교!!",
        "칠월 칠석!!",
        "김다리",
        100,
        "목차입니다.",
        20000,
        "2023-02-01"
    );

INSERT INTO
    books (
        title,
        img,
        category_id,
        form,
        isbn,
        summary,
        detail,
        author,
        pages,
        contents,
        price,
        pub_date
    )
VALUES (
        "효녀 심청",
        12,
        0,
        "종이책",
        9,
        "심청아..",
        "공양미 삼백석..",
        "김심청",
        100,
        "목차입니다.",
        20000,
        "2023-01-15"
    );

INSERT INTO
    books (
        title,
        img,
        category_id,
        form,
        isbn,
        summary,
        detail,
        author,
        pages,
        contents,
        price,
        pub_date
    )
VALUES (
        "혹부리 영감",
        22,
        2,
        "ebook",
        10,
        "노래 주머니..",
        "혹 두개 되버림..",
        "김영감",
        100,
        "목차입니다.",
        20000,
        "2023-06-05"
    );

SELECT *
FROM books
    LEFT JOIN categories ON books.category_id = category_id;

SELECT *
FROM books
    LEFT JOIN categories ON books.category_id = categories.id
WHERE
    books.id = 1;

-- 중복된 컬럼으로 오류 발생
-- SELECT * FROM books LEFT JOIN categories ON books.category_id = categories.id WHERE books.id=?

SELECT
    books.id AS book_id,
    books.title,
    books.category_id,
    books.img,
    books.author,
    books.summary,
    books.price,
    categories.id AS category_ref_id,
    categories.category_name AS category_name
FROM books
    LEFT JOIN categories ON books.category_id = categories.id
WHERE
    books.id = ?;

SELECT books.*, categories.id AS category_id, categories.category_name
FROM books
    LEFT JOIN categories ON books.category_id = categories.id
WHERE
    books.id = ?;

-- 장바구니 담기
INSERT INTO cart_items (book_id, quantity, user_id) VALUES (1, 1, 1);

-- 장바구니 조회
SELECT cart_items.cart_id, cart_items.book_id, books.title, books.summary, cart_items.quantity, books.price
FROM cart_items
    LEFT JOIN books ON cart_items.book_id = books.book_id;

-- 장바구니에서 선택한 상품 조회
SELECT *
FROM bookshop.cart_items
WHERE
    user_id = 1
    AND user_id IN (1, 2);

-- 주문하기
-- 배송 정보 입력
INSERT INTO
    deliverys (address, receiver, contact)
VALUES ("서울시", "홍길동", "010-0000-0000");

const deliveryId = SELECT MAX(delivery_id) FROM deliverys;

-- 주문 정보 입력
INSERT INTO
    orders (
        book_title,
        total_price,
        total_quantity,
        delivery_id,
        user_id
    )
VALUES ("어린왕자들", 60000, 3, 1, 1);
const orderId = SELECT MAX(order_id) FROM orders;

-- 주문 상세 목록 입력
INSERT INTO
    ordered_book (order_id, book_id, quantity)
VALUES (orderId, 2, 1);

SELECT max(ordered_id) FROM bookshop.ordered_book