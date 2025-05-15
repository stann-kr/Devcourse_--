const express = require("express");
const pool = require("../mariadb");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");

dotenv.config();

const SQL = {
    SELECT_USER_BY_EMAIL: "SELECT * FROM users WHERE email = ?",
    DELETE_USER_BY_EMAIL: "DELETE FROM users WHERE email = ?",
    INSERT_USER:
        "INSERT INTO users ( email, password, user_name) VALUES (?, ?, ?)",
    UPDATE_USER_SET_PW: "UPDATE users SET password = ? WHERE email = ?",
};

async function getUserByEmail(email) {
    const results = await pool.query(SQL.SELECT_USER_BY_EMAIL, [email]);
    return results[0];
}

const login = async (req, res) => {
    const { email, password } = req.body;
    const sql = SQL.SELECT_USER_BY_EMAIL;

    try {
        const results = await pool.query(sql, [email]);
        const loginUser = results[0];

        if (!loginUser) {
            return res.status(StatusCodes.FORBIDDEN).json({
                message: "이메일 또는 비밀번호가 일치하지 않습니다.",
            });
        }

        const match = await bcrypt.compare(password, loginUser.password);
        if (!match) {
            return res.status(StatusCodes.FORBIDDEN).json({
                message: "이메일 또는 비밀번호가 일치하지 않습니다.",
            });
        }

        const payload = {
            email: loginUser.email,
        };

        const token = jwt.sign(payload, process.env.PRIVATE_KEY, {
            expiresIn: "30m",
            issuer: "stann",
        });

        res.cookie("token", token, { httpOnly: true });

        return res.status(StatusCodes.OK).json({
            message: `${loginUser.user_name}님 로그인 되었습니다.`,
        });
    } catch (err) {
        console.error(err);
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ message: "서버 오류" });
    }
};

const join = async (req, res) => {
    const { email, password, user_name } = req.body;

    try {
        const checkEmailSql = SQL.SELECT_USER_BY_EMAIL;
        const existing = await pool.query(checkEmailSql, [email]);

        if (existing.length) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ message: "이미 가입된 이메일입니다." });
        }

        const hash = await bcrypt.hash(password, 10);

        const insertSql = SQL.INSERT_USER;
        await pool.query(insertSql, [email, hash, user_name]);

        return res.status(StatusCodes.CREATED).json({
            message: "회원가입 성공",
        });
    } catch (err) {
        console.error(err);
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ message: "서버 오류" });
    }
};

const passwordResetRequest = async (req, res) => {
    const { email } = req.body;
    const sql = SQL.SELECT_USER_BY_EMAIL;

    try {
        const results = await pool.query(sql, [email]);
        const user = results[0];

        console.log(user);

        res.json({
            email: email,
        });
    } catch (err) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ message: "서버 오류" });
    }
};

const passwordReset = async (req, res) => {
    try {
        const { password, email } = req.body;
        const user = await getUserByEmail(email);
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "존재하지 않는 이메일입니다.",
            });
        }
        const hash = await bcrypt.hash(password, 10);
        
        await pool.query(SQL.UPDATE_USER_SET_PW, [hash, email]);
        
        return res.status(StatusCodes.OK).json({
            message: "비밀번호 변경 완료",
        });
    } catch (err) {
        console.error(err);
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ message: "서버 오류" });
    }
};

module.exports = {
    login,
    join,
    passwordResetRequest,
    passwordReset,
};
