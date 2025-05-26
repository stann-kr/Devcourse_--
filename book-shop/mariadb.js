const mariadb = require("mariadb");
require("dotenv").config();

const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    dateStrings: true
});

// pool.getConnection()
//     .then((conn) => {
//         console.log("MariaDB connected!");
//         conn.release();
//     })
//     .catch((err) => {
//         console.error("DB Connection Error:", err);
//     });

module.exports = pool;
