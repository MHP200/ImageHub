const express = require('express');
const router = express.Router();
const md5 = require('md5');
const mysql = require('mysql');

router.get('/', function (req, res, next) {
    if (req.auth['status']) res.redirect(req.make_url(''));
    let err = req.query.err ? req.query.err : '';

    res.render('register', {
        style: 'auth.css',
        js: 'register.js',
        err: err
    });
});

router.post('/', function (req, res, next) {
    if (req.auth['status']) res.redirect(req.make_url(''));

    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;
    let password_confirmation = req.body.password_confirmation;

    let username_valid = /^[a-zA-Z]+ ?[a-zA-Z0-9]*? ?[a-zA-Z0-9]*?$/.test(username);
    let password_valid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
    let password_confirmation_valid = password === password_confirmation;

    if (!username_valid || !password_valid || !password_confirmation_valid) {
        res.redirect(req.make_url('register?err=invalid'));
    } else {
        const failed = function () {
            res.render('register', {
                style: 'auth.css',
                js: 'register.js',
                failed: true
            });
        };
    
        let sql = "SELECT * FROM users WHERE email = ? OR username = ?";
        sql = mysql.format(sql, [email, username]);
        req.db(sql, function (rows) {
            if (rows.length > 0) {
                res.render('register', {
                    style: 'auth.css',
                    js: 'register.js',
                    taken: true
                });
            } else {
                let hash = md5(password);
                sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
                sql = mysql.format(sql, [username, email, hash]);
                req.db(sql, function () {
                    res.redirect(req.make_url('login'));
                }, failed);
            }
        }, failed);
    }
});

module.exports = router;
