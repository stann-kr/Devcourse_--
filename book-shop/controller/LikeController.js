const pool = require("../mariadb");
const { StatusCodes } = require("http-status-codes");

const likeAdd = async (req, res) => {
    const { id: book_id } = req.params;
    const { user_id } = req.body;

    try {
        await pool.query(
            "INSERT INTO likes (user_id, book_id) VALUES (?, ?)",
            [user_id, book_id]
        );
        return res.status(StatusCodes.CREATED).json({ message: "좋아요 추가" });
    } catch (err) {
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "서버 오류" });
    }
}

const likeDelete = async (req, res) => {
    const { id: book_id } = req.params;
    const { user_id } = req.body;

    try {
        await pool.query(
            "DELETE FROM likes WHERE  user_id = ? AND book_id = ?",
            [user_id, book_id]
        );
        return res.status(StatusCodes.OK).json({ message: "좋아요 삭제" });
    } catch (err) {
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "서버 오류" });
    }
}

module.exports = {
    likeAdd,
    likeDelete,
};