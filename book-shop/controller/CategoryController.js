const pool = require("../mariadb");
const { StatusCodes } = require("http-status-codes");

const SQL = {
    SELECT_CATEGORY_BOOKS: "SELECT * FROM categories",
};

const categoryAll = async (req, res) => {
    try {

        const books = await pool.query(SQL.SELECT_CATEGORY_BOOKS);
        return res.status(StatusCodes.OK).json({ books });
    } catch (err) {
        console.log(err);
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ message: "서버 오류" });
    }
};

module.exports = {
    categoryAll,
};
