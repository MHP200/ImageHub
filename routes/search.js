const express = require('express');
const moment = require("moment");
const router = express.Router();
const mysql = require('mysql');

/* GET home page. */
router.get('/', function (req, res, next) {
    let query = req.query.query;

    const result_page = function (images) {
        res.render('home', {
            style: 'home.css',
            auth: req.auth['status'],
            images: images,
        });
    }

    let sql = "SELECT * FROM posts WHERE title LIKE CONCAT('%', ?,  '%') OR description LIKE CONCAT('%', ?,  '%')";
    sql = mysql.format(sql, [query, query]);
    req.db(sql, function (result) {
        let images = [];
        for (let i=0; i<result.length; i++) {
            images.push({
                img: 'uploads/' + result[i]['img_path'],
                url: 'image/' + result[i]['id']
            });
        }
        result_page(images);
    }, () => {
        result_page([]);
    })

});

module.exports = router;
