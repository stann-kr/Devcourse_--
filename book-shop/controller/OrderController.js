const pool = require("../mariadb");
const { StatusCodes } = require("http-status-codes");
const sanitizeBigInt = require("../utils/sanitizeBigInt");

const SQL = {
    INSERT_DELIVERY: "INSERT INTO deliverys( address, receiver, contact ) VALUES (?, ?, ?)",
    INSERT_ORDER: "INSERT INTO orders( book_title, total_price, total_quantity, delivery_id, user_id ) VALUES (?, ?, ?, ?, ?)",
};

const order = async (req, res) => {
    // const { delivery } = req.body;
    const { items, delivery, totalQuantity, totalPirce, userId } = req.body;

    let deliveryId;
    console.log(delivery);
    try {
        const order = await pool.query(SQL.INSERT_DELIVERY, [delivery.address, delivery.receiver, delivery.contact]);
        deliveryId = order.insertId;

        
        return res.status(StatusCodes.CREATED).json(sanitizeBigInt(order));
    } catch (err) {
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "서버 오류" });
    };

};

const orderGet = async (req, res) => {

};

const orderDetail = async (req, res) => {

};

module.exports = {
    order,
    orderGet,
    orderDetail
};