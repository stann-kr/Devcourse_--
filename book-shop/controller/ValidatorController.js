const { body, param, validationResult } = require("express-validator");
const { StatusCodes } = require("http-status-codes");

const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        return next();
    } else {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "유효하지 않은 요청입니다.",
            errors: errors.array(),
        });
    }
};

const loginValidator = [
    body("email")
        .notEmpty()
        .isString()
        .isLength({ min: 5, max: 50 })
        .withMessage("이메일은 최소 5자 이상, 최대 50자 이하이어야 합니다.")
        .isEmail()
        .withMessage("이메일 형식이 아닙니다."),
    body("password").notEmpty().withMessage("비밀번호를 입력해주세요."),
    validate,
];

const joinValidator = [
    body("email")
        .notEmpty()
        .isString()
        .isLength({ min: 5, max: 50 })
        .withMessage("이메일은 최소 5자 이상, 최대 50자 이하이어야 합니다.")
        .isEmail()
        .withMessage("이메일 형식이 아닙니다."),
    body("password")
        .notEmpty()
        .isString()
        .isLength({ min: 8, max: 20 })
        .withMessage("비밀번호는 최소 8자 이상, 최대 20자 이하이어야 합니다."),
    body("user_name").notEmpty().isString(),
    validate,
];

module.exports = {
    loginValidator,
    joinValidator,
};
