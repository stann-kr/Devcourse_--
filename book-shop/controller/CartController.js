const pool = require("../mariadb");
const { StatusCodes } = require("http-status-codes");

const SQL = {
    SELECT_CART: "SELECT * FROM cart_items WHERE user_id = ?",
    INSERT_CART: "INSERT INTO cart_items (user_id, book_id, quantity) VALUES (?, ?, ?)",
    DELETE_CART: "DELETE FROM cart_items WHERE cart_id = ?",
    GET_CART_BY_USER: "SELECT cart_items.cart_id, cart_items.book_id, books.title, books.summary, cart_items.quantity, books.price FROM cart_items LEFT JOIN books ON cart_items.book_id = books.book_id WHERE user_id = ? AND cart_items.cart_id IN (?)",
};

// 장바구니 추가
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

// 장바구니 전체 조회
const cartAll = async (req, res) => {
    const { user_id, selected } = req.body; // selected = [1, 2]
    try {
        const books = await pool.query(SQL.GET_CART_BY_USER, [user_id, selected]);
        return res.status(StatusCodes.OK).json({ books });
    } catch (err) {
        console.log(err);
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ message: "서버 오류" });
    };
};

// 장바구니 삭제
const cartDelete = async (req, res) => {
    const { cartId } = req.params;

    try {
        const result = await pool.query(SQL.DELETE_CART, [cartId]);

        if (result.affectedRows === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "해당 장바구니 항목이 존재하지 않습니다." });
        }

        return res.status(StatusCodes.OK).json({ message: "장바구니 삭제" });
    } catch (err) {
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "서버 오류" });
    };
};


module.exports = {
    cartAdd,
    cartAll,
    cartDelete
};