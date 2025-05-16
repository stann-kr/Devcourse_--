const express = require("express");
const router = express.Router();

const {
    bookAll,
    bookDetail,
    bookCat
} = require("../controller/BookController");

router.use(express.json());

// 전체 도서 조회
router.get("/", bookAll);

// 개별 도서 조회
router.get("/:id", bookDetail);


module.exports = router;
