const express = require("express");
const router = express.Router();

const {
    categoryAll,
} = require("../controller/CategoryController");

router.use(express.json());

// 전체 도서 조회
router.get("/", categoryAll);


module.exports = router;
