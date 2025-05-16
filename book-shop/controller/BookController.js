const { parse } = require("dotenv");
const pool = require("../mariadb");
const { StatusCodes } = require("http-status-codes");

const SQL = {
    SELECT_ALL_BOOKS: "SELECT * FROM books LIMIT 10",
    SELECT_BOOK: "SELECT * FROM books WHERE id = ?",
    SELECT_CATEGORY_BOOKS: "SELECT * FROM books WHERE category_id = ?",
};

const bookAll = async (req, res) => {
    try {
        const categoryId = req.query.categoryId

        if (categoryId) {
            const book = await pool.query(SQL.SELECT_CATEGORY_BOOKS, [categoryId]);
            if (book.length > 0) {
                return res.status(StatusCodes.OK).json(book);
            } else {
                return res
                    .status(StatusCodes.NOT_FOUND)
                    .json({ message: "정보를 찾을 수 없음" });
            }
        }

        
        const books = await pool.query(SQL.SELECT_ALL_BOOKS);
        return res.status(StatusCodes.OK).json({ books });
    } catch (err) {
        console.log(err);
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ message: "서버 오류" });
    }
};

const bookDetail = async (req, res) => {
    try {
        const bookId = parseInt(req.params.id, 10);
        const book = await pool.query(SQL.SELECT_BOOK, [bookId]);

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
