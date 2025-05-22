const pool = require("../mariadb");
const { StatusCodes } = require("http-status-codes");

const SQL = {
    SELECT_CART: "SELECT * FROM cart_items WHERE user_id = ?",
    INSERT_CART: "INSERT INTO cart_items (user_id, book_id, quantity) VALUES (?, ?, ?)",
    DELETE_CART: "DELETE FROM cart_items WHERE user_id = ? AND book_id = ?",
};

const cartAdd = async (req, res) => {
    const { user_id, book_id, quantity } = req.body;

    try {
        const cart = await pool.query(SQL.INSERT_CART, [user_id, book_id, quantity]);
        return res.status(StatusCodes.CREATED).json({ message: "장바구니 추가" });
    } catch (err) {
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "서버 오류" });
    };
};

module.exports = {
    cartAdd,
};