import mysql from "mysql";
import "dotenv/config";

const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
  port: process.env.DATABASE_PORT,
});

connection.connect((err) => {
  if (err) throw err;
  //console.log("connection established");
});

export default connection;
