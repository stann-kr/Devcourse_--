const { parse } = require("dotenv");
const pool = require("../mariadb");
const { StatusCodes } = require("http-status-codes");

const SQL = {
    SELECT_ALL_FROM: "SELECT * FROM books",
    SELECT_ALL_BOOKS_LIMIT: "LIMIT 10",
    SELECT_BOOK: "WHERE id = ?",
    SELECT_BOOK_ID_CATEGORY: "SELECT books.*, categories.id AS category_id, categories.category_name FROM books LEFT JOIN categories ON books.category_id = categories.id WHERE books.id = ?;",
    SELECT_BOOK_ID_CATEGORY_NEW: "SELECT * FROM books WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW() AND category = ?;",
    SELECT_BOOK_ID_NEW: "SELECT * FROM books WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW();",
    SELECT_BOOKS_WITH_CATEGORY_JOIN: `
        SELECT books.*, categories.category_name
        FROM books
        LEFT JOIN categories ON books.category_id = categories.id
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

        return res.status(StatusCodes.OK).json({
            data: books,
            // meta: {
            //     currentPage,
            //     limit,
            //     count: books.length,
            // },
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
