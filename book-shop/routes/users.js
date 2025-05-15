// express 모듈 셋팅
const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const {
    join,
    login,
    passwordResetRequest,
    passwordReset,
} = require("../controller/UserController");
const {
    loginValidator,
    joinValidator,
} = require("../controller/ValidatorController");

dotenv.config();

router.use(express.json());

// 로그인
router.post("/login", loginValidator, login);
// 회원가입
router.post("/join", joinValidator, join);

router.post("/reset", passwordResetRequest);

router.put("/reset", passwordReset);

module.exports = router;
