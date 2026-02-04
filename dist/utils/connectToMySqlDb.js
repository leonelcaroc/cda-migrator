import mysql from "mysql2";
const connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT),
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB,
});
connection.connect((err) => {
    if (err) {
        console.error("❌ MySQL connection failed:", err.message);
        process.exit(1);
    }
    console.log("✅ MySQL connected successfully");
});
connection.on("error", (err) => {
    console.error("⚠️ MySQL runtime error:", err);
});
export default connection;
//# sourceMappingURL=connectToMySqlDb.js.map