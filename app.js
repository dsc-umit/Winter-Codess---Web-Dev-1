const express = require('express');
const session = require('express-session');
const path = require('path');
const pageRouter = require('./routes/pages');
const app = express();
// const ejs = require("ejs");

// for body parser. to collect data that sent from the client.
app.use(express.urlencoded({ extended: false }));


// Serve static files. CSS, Images, JS files ... etc
app.use("/static", express.static(__dirname + '/static'));


// Template engine. PUG
// app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// session
app.use(session({
    secret: 'codeninja',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 1000 * 30
    }
}));


// // Routers
app.use('/', pageRouter);

// app.get("/home", (req, res) => {
//     res.render("admin/index.ejs",);
// });
// app.get("/about", (req, res) => {
//     res.render("admin/about.ejs",);
// });
// app.get("/cart", (req, res) => {
//     res.render("admin/cart.ejs",);
// });
// app.get("/contact", (req, res) => {
//     res.render("admin/contact.ejs",);
// });

// Errors => page not found 404
app.use((req, res, next) => {
    var err = new Error('Page not found');
    err.status = 404;
    next(err);
})

// Handling errors (send them to the client)
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send(err.message);
});

// Setting up the server
app.listen(3000, () => {
    console.log('Server is running on port 3000...');
});

module.exports = app;