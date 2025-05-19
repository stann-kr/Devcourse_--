const express = require("express");
const router = express.Router();
const {likeAdd, likeDelete} = require("../controller/LikeController");

router.use(express.json());

// 좋아요 추가
router.post("/:id", likeAdd);

// 좋아요 삭제
router.delete("/:id", likeDelete);

// 카테고리별 도서 조회


module.exports = router;
