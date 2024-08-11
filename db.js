require('dotenv').config()

const mysql = require('mysql2')

const{DB_HOST, DB_USERNAME, DB_NAME, DB_PASSWORD} = process.env
const mysqlConnection = mysql.createConnection({
    host:DB_HOST,
    user:DB_USERNAME,
    password:DB_PASSWORD,
    database:DB_NAME
})

module.exports= mysqlConnection
