require("dotenv").config()
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const authRouter = require('./routes/auth.route');
const { error } = require('console');
const adsRouter = require("./routes/ads.route");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req,res)=> res.render("index"))

app.use(authRouter)
app.use(adsRouter)

app.use(function(req, res, next) {
  res.render("404")
});

// error handler
app.use(function(err, req, res, next) {
 
  res.status(err.status || 500);
  res.json(error)
});

module.exports = app;
