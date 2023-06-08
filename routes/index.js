const express = require('express');
const moment = require("moment");
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    const result_page = function (images) {
        res.render('home', {
            style: 'home.css',
            auth: req.auth['status'],
            images: images,
        });
    }

    req.db('SELECT * FROM posts', function (result) {
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
