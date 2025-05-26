const express = require("express");
const router = express.Router();

const { cartAdd, cartAll, cartDelete } = require("../controller/CartController");

router.use(express.json());

// 장바구니 담기
router.post("/", cartAdd);

// 장바구니 전체 조회
// 장바구니에서 선택한 주문 상품 목록 조회
router.get("/", cartAll);

// 장바구니 삭제
router.delete("/:cartId", cartDelete);

module.exports = router;
