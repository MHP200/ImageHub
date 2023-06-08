const express = require('express');
const router = express.Router();
const moment = require('moment');
const mysql = require('mysql');

router.get('/:id', function (req, res, next) {
    let id = req.params.id;
    let err = req.query.err ? req.query.err : '';
    const render = function(image, comments) {
        res.render('image', {
            style: 'image.css',
            auth: req.auth['status'],
            id: id,
            post_url: req.make_url('image/' + id),
            title: image['title'],
            desc: image['description'],
            img: req.make_url('uploads/' + image['img_path']),
            author: image['username'],
            date: moment(image['created_at']).fromNow(),
            comments: comments,
            js: 'comment.js',
            err: err
        });
    }

    let sql = "SELECT P.*, U.username FROM posts P, users U WHERE P.user_id = U.id AND P.id = ?";
    sql = mysql.format(sql ,[id]);
    req.db(sql, function (result) {
        let image = result[0];

        sql = "SELECT C.*, U.username FROM comments C, users U WHERE C.user_id = U.id AND post_id = ?";
        sql = mysql.format(sql, [id]);
        req.db(sql, function (result) {
            render(image, result);
        }, function() {
            render(image, []);
        });
    }, () => {
        res.sendStatus(404);
    })
});

router.post('/:id', function (req, res, next) {
    if (!req.auth['status']) res.redirect(req.make_url('login'));

    let id = req.params.id;
    let user_id = req.auth['id'];
    let content = req.body.content;

    let comment_valid = /^[a-zA-Z,() .!?-_]+$/.test(content);
    if (!comment_valid) {
        res.redirect(req.make_url('image/' + id + '?err=invalid'));
    } else {
        const redirect = function() {
            res.redirect(req.make_url('image/' + id));
        };
    
        let sql = "INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)";
        sql = mysql.format(sql, [id, user_id, content]);
        req.db(`INSERT INTO comments (post_id, user_id, content) VALUES ('${id}', '${user_id}', "${content}")`, redirect, redirect);
    }
});

module.exports = router;
