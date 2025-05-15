const express = require("express");
const router = express.Router();

router.use(express.json());

// 좋아요 추가
router.post("/:id", (req, res) => {
    res.json("좋아요 추가");
});

// 좋아요 삭제
router.delete("/:id", (req, res) => {
    res.json("좋아요 삭제");
});

// 카테고리별 도서 조회


module.exports = router;
