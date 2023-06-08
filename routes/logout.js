const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.clearCookie('auth');
    res.redirect(req.make_url(''));
});

module.exports = router;
