const pool = require("../mariadb");
const { StatusCodes } = require("http-status-codes");

// SQL 쿼리 정리 및 주석 추가
const SQL = {
    // 전체 도서 조회
    SELECT_ALL_FROM: `
        SELECT * FROM books
    `,
    // 도서 10개 제한 조회
    SELECT_ALL_BOOKS_LIMIT: `
        SELECT * FROM books LIMIT 10
    `,
    // 특정 도서 조회 (id)
    SELECT_BOOK: `
        SELECT * FROM books WHERE books_id = ?
    `,
    // 도서 상세 + 카테고리명 + 좋아요 개수
    SELECT_BOOK_ID_CATEGORY: `
        SELECT books.*,
            categories.categories_id AS category_id,
            categories.category_name,
            (SELECT COUNT(*) FROM likes WHERE likes.book_id = books.books_id) AS likes
        FROM books
        LEFT JOIN categories ON books.category_id = categories.categories_id
        WHERE books.books_id = ?
    `,
    // 최근 1개월 내 카테고리별 신간
    SELECT_BOOK_ID_CATEGORY_NEW: `
        SELECT * FROM books
        WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()
        AND category_id = ?
    `,
    // 최근 1개월 내 신간
    SELECT_BOOK_ID_NEW: `
        SELECT * FROM books
        WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()
    `,
    // 전체 도서 + 카테고리명 + 좋아요 개수
    SELECT_BOOKS_WITH_CATEGORY_JOIN: `
        SELECT books.*,
            categories.category_name,
            (SELECT COUNT(*) FROM likes WHERE likes.book_id = books.books_id) AS likes
        FROM books
        LEFT JOIN categories ON books.category_id = categories.categories_id
    `,
};

const bookAll = async (req, res) => {
    // LIMIT 최대 값
    const MAX_LIMIT = 50;
    let { category_id, news, limit, currentPage } = req.query;

    // limit 보정
    limit = parseInt(limit, 10);
    if (isNaN(limit) || limit <= 0 || limit > MAX_LIMIT) limit = 10;

    // currentPage 보정
    currentPage = parseInt(currentPage, 10);
    if (isNaN(currentPage) || currentPage < 1) currentPage = 1;

    const offset = (currentPage - 1) * limit;
    const values = [];
    const conditions = [];

    let sql = SQL.SELECT_BOOKS_WITH_CATEGORY_JOIN;

    const parsedCategoryId = parseInt(category_id, 10);
    if (!isNaN(parsedCategoryId)) {
        conditions.push("books.category_id = ?");
        values.push(parsedCategoryId);
    }

    if (news === "true" || news === "1") {
        conditions.push("books.pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()");
    }

    if (conditions.length > 0) {
        sql += " WHERE " + conditions.join(" AND ");
    }

    sql += " LIMIT ? OFFSET ?";
    values.push(limit, offset);

    try {
        const books = await pool.query(sql, values);
        if (books.length === 0) {
            return res
                .status(StatusCodes.NO_CONTENT)
                .json({ message: "해당 조건에 맞는 도서가 없습니다." });
        }

        //COUNT(*) 결과가 JavaScript의 BigInt로 반환되어, JSON.stringify가 이를 직렬화하지 못해 발생
        // BigInt를 Number로 변환하여 JSON.stringify가 직렬화할 수 있도록 처리
        const booksSerialized = books.map(book => {
            const obj = { ...book };
            Object.keys(obj).forEach(key => {
                if (typeof obj[key] === 'bigint') {
                    obj[key] = Number(obj[key]);
                }
            });
            return obj;
        });

        return res.status(StatusCodes.OK).json({
            data: booksSerialized,
        });
    } catch (err) {
        console.error(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "서버 오류" });
    }
};

const bookDetail = async (req, res) => {
    try {
        const bookId = parseInt(req.params.id, 10);
        const book = await pool.query(SQL.SELECT_BOOK_ID_CATEGORY, [bookId]);

        if (book.length > 0) {
            return res.status(StatusCodes.OK).json(book);
        } else {
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ message: "정보를 찾을 수 없음" });
        }
    } catch (err) {
        console.log(err);
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ message: "서버 오류" });
    }
};

module.exports = {
    bookAll,
    bookDetail,
};
