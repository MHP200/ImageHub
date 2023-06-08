const mysql = require('mysql');
require('dotenv').config();


/**
 * Define Tables Schema
 */
const TABLE_USERS = "CREATE TABLE IF NOT EXISTS users (id INT NOT NULL AUTO_INCREMENT , email VARCHAR(100) NOT NULL , username VARCHAR(100) NOT NULL , password VARCHAR(100) NOT NULL , PRIMARY KEY (id));";
const TABLE_POSTS = "CREATE TABLE IF NOT EXISTS posts (id INT NOT NULL AUTO_INCREMENT , user_id INT NOT NULL , description TEXT NULL , title VARCHAR(256) NOT NULL , img_path VARCHAR(256) NOT NULL , created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , PRIMARY KEY (id));";
const TABLE_COMMENTS = "CREATE TABLE IF NOT EXISTS final_project.comments ( id INT NOT NULL AUTO_INCREMENT , post_id INT NOT NULL , user_id INT NOT NULL , content TEXT NOT NULL , created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , PRIMARY KEY (id));";

const tables = [TABLE_USERS, TABLE_POSTS, TABLE_COMMENTS];



/**
 * Create Tables
 */
 const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});
connection.connect();

tables.forEach(function(query) {
    connection.query(query, (err, rows, fields) => {
        if (err) {
            console.log('==============================================');
            console.log('Failed to create table.');
            console.log(err);
            console.log('==============================================');
        }
    });
});


console.log("All tables were created successfully!");
connection.end();