const express = require('express');
const router = express.Router();
const md5 = require('md5');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');

/* GET users listing. */
router.get('/', function (req, res, next) {
    if (req.auth['status']) res.redirect(req.make_url(''));

    res.render('login', {
        style: 'auth.css',
        auth: req.auth['status'],
    });
});

router.post('/', function (req, res, next) {
    if (req.auth['status']) res.redirect(req.make_url(''));

    let email = req.body.email;
    let password = req.body.password;

    const onSuccess = function (user) {
        let data = {id: user['id'], username: user['username'], email: user['email']};
        let token = jwt.sign(data, req.private_secret, {expiresIn: '1h'});
        res.cookie('auth', token, {maxAge: 60 * 60 * 1000});
        res.redirect(req.make_url(''));
    };

    const onFailed = function () {
        res.render('login', {
            style: 'auth.css',
            auth: false,
            failed: true
        });
    };

    let hash = md5(password);
    let sql = "SELECT * FROM users WHERE email = ? AND password = ?";
    sql = mysql.format(sql, [email, hash]);
    req.db(sql, function (rows) {
        if (rows.length > 0) {
            onSuccess(rows[0]);
        } else {
            onFailed();
        }
    }, onFailed);
});

module.exports = router;
