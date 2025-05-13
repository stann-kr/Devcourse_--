const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const payload = {
    user_id: loginUser.userId,
    name: loginUser.name,
    email: loginUser.email,
};
//
const token = jwt.sign(payload, process.env.PRIVATE_KEY, {
    expiresIn: "30m",
    issuer: "stann",
});

jwt.verify(token, PRIVATE_KEY, (err, decoded) => {
    if (err) {
        console.log(err);
    } else {
        console.log(decoded);
    }
});
