const createError = require('http-errors');
const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const handlebars = require('express-handlebars');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const moment = require('moment');
require('dotenv').config();

const BASE_URL = process.env.APP_URL;
const PRIVATE_SECRET = process.env.APP_SECRET;

/***************************************************************
 * Helpers
 ***************************************************************/
let hbs = handlebars.create({
    helpers: {
        stylesheet(name) {
            return BASE_URL + '/stylesheets/' + name;
        },
        script(name) {
            return BASE_URL + '/javascripts/' + name;
        },
        url(address) {
            return BASE_URL + '/' + address;
        },
        site_title() {
            return 'Photo Gallery';
        },
        format_date(date) {
            return moment(date).fromNow();
        },
        eq(v1, v2) {
            return v1 === v2;
        }
    }
});
/***************************************************************
 * End
 ***************************************************************/

let app = express();

app.use(fileUpload({
    createParentPath: true
}));

// Set database helper
app.use(function(req,res,next){
    req.db = function (query, ok_callback, err_callback) {
        const connection = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT
        });
        connection.connect();
        connection.query(query, (err, rows, fields) => {
            if (err) {
                console.log('==============================================');
                console.log('Failed to connect to database.');
                console.log(err);
                console.log('==============================================');
                if (typeof err_callback !== "undefined") err_callback();
            } else {
                ok_callback(rows);
            }
        });
        connection.end();
    };
    next();
});

// Set application global variables
app.use(function(req,res,next){
    req.private_secret = PRIVATE_SECRET;
    req.make_url = function (address) {
        return BASE_URL + '/' + address;
    };
    next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


/***************************************************************
 * Get auth status
 ***************************************************************/
app.use(function(req,res,next){
    req.auth = {status: false};
    try {
        let data = jwt.verify(req.cookies['auth'], PRIVATE_SECRET);
        req.auth = {
            status: true,
            id: data['id'],
            email: data['email'],
            username: data['username']
        };
    } catch(err) {
        res.clearCookie('auth');
    }
    next();
});
/***************************************************************
 * End
 ***************************************************************/


/***************************************************************
 * Define Routes
 ***************************************************************/
const indexRouter = require('./routes/index');
const searchRouter = require('./routes/search');
const imageRouter = require('./routes/image');
const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');
const registerRouter = require('./routes/register');
const createImageRouter = require('./routes/create_image');

app.use('/', indexRouter);
app.use('/search', searchRouter);
app.use('/image', imageRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/register', registerRouter);
app.use('/create', createImageRouter);
/***************************************************************
 * End
 ***************************************************************/


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
