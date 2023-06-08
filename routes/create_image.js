const express = require('express');
const router = express.Router();
const md5 = require('md5');
const path = require('path');
const mysql = require('mysql');

router.get('/', function (req, res, next) {
    if (!req.auth['status']) res.redirect(req.make_url('login'));
    let err = req.query.err ? req.query.err : '';

    res.render('create', {
        auth: true,
        js: 'create.js',
        err: err
    });
});

router.post('/', function (req, res, next) {
    if (!req.auth['status']) res.redirect(req.make_url('login'));

    let title = req.body.title;
    let desc = req.body.desc;

    let title_valid = /^[a-zA-Z,() .!?-_]+$/.test(title);
    let desc_valid = /^[a-zA-Z,() .!?-_]+$/.test(desc);
    if (!title_valid || !desc_valid) {
        res.redirect(req.make_url('create?err=invalid'));
    } else {
        const allowedExtension = ['.png','.jpg','.jpeg'];
        let image = req.files['image'];
        const extension = path.extname(image.name);

        if(!allowedExtension.includes(extension)){
            res.render('create', {
                auth: true,
                invalidFormat: true,
                js: 'create.js'
            });
        }

        let seconds = new Date() / 1000;
        let name = md5(seconds);
        name = name + extension;

        const failed = function () {
            res.render('create', {
                failed: true,
                auth: true,
                js: 'create.js'
            });
        }

        image.mv('./public/uploads/' + name);

        let user_id = req.auth['id'];

        let sql = "INSERT INTO posts (user_id, title, description, img_path) VALUES (?, ?, ?, ?)";
        sql = mysql.format(sql, [user_id, title, desc, name]);
        req.db(sql, function (result) {
            res.redirect(req.make_url(`image/${result.insertId}`));
        }, failed);
    }
});

module.exports = router;
