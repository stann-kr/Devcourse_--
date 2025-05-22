const express = require("express");
const router = express.Router();

const { cartAdd } = require("../controller/CartController");

router.use(express.json());

// 장바구니 담기
router.post("/", cartAdd);

module.exports = router;
