require("dotenv").config();
const express = require("express");
// const session = require("express-session");
// const MySQLStore = require("express-mysql-session")(session);
const cookieParser = require("cookie-parser");

// Assuming `pool` is exported from `./db.js`
// const { pool } = require("./db");

// const sessionStore = new MySQLStore({}, pool, (error) => {
  // if (error) {
    // console.error('Sess/ion store initialization error:', error);
  // }
// });

const setupMiddleware = (app) => {
    app.use(express.json());
    app.use(cookieParser());
    app.use(express.urlencoded({ extended: true }));
    // app.use(session({
    //     key: "session_cookie_name",
    //     secret: process.env.SESSION_SECRET,
    //     store: sessionStore,
    //     resave: false,
    //     saveUninitialized: false,
    //     cookie: {
    //         maxAge: 365 * 60 * 60 * 1000, // 30 days
    //         httpOnly: true,
    //         secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    //     },
    // }));
    // app.use((req, res, next) => {
    //   console.log(`Session ID: ${req.sessionID}, User ID: ${req.session.userId}`);
    //   next();
    // });  
};

module.exports = setupMiddleware;
