const express = require("express");
const router = express.Router();
const { order, orderGet, orderDetail } = require("../controller/OrderController");

router.use(express.json());

// 주문 하기
router.post("/", order);

// 주문 목록 조회
router.get("/", orderGet);

// 주문 상세 상품 조회
router.get("/:id", orderDetail);

module.exports = router;