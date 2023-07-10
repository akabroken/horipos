//Imports the http-errors module, which is used to create HTTP errors for Express.js applications.
var createError = require('http-errors');
//Imports the express module, which is the core framework for building web applications in Node.js.
var express = require('express');
//Imports the path module, which provides utilities for working with file and directory paths.
var path = require('path');
//Imports the express-flash module, which provides flash messages to display temporary messages to the user.
var flash = require('express-flash');
//Imports the express-session module, which enables session management for Express.js applications.
var session = require('express-session');
//Imports the mysql module, which is a MySQL database driver for Node.js.
var mysql = require('mysql');
//Imports a custom module db.js from the lib directory, which contains the MySQL database connection configuration.
var connection = require('./lib/db');
//Imports a router module users.js from the routes directory, which handles user-related routes.
var usersRouter = require('./routes/users');
var rootRouter = require('./routes/root/root');
//Imports a router module login.js from the routes directory, which handles login-related routes.
//var loginRouter = require('./routes/login');
//Creates an instance of the Express.js application.
var app = express();

// view engine setup
//Sets the views directory as the location to look for view templates (EJS files).
app.set('views', path.join(__dirname, 'views'));
//Sets EJS (Embedded JavaScript) as the template engine for rendering views.
app.set('view engine', 'ejs');
//Parses JSON-encoded data sent in the request body.
app.use(express.json());
//Parses URL-encoded data sent in the request body.
app.use(express.urlencoded({ extended: false }));
//Serves static files from the public directory, such as CSS stylesheets or client-side JavaScript files.
app.use(express.static(path.join(__dirname, 'public')));
//Configures the session middleware with the provided options. It sets up a session for each client and stores session data in memory.
app.use(session({
    cookie: { maxAge: 60000 },
    store: new session.MemoryStore,
    saveUninitialized: true,
    resave: 'true',
    secret: 'secret'
}))
//Configures the flash middleware to enable flash messages.
app.use(flash());
//Mounts the usersRouter middleware at the /users URL path, so all requests to /users will be handled by the usersRouter.
app.use('/users', usersRouter);
app.use('/root',rootRouter );


// catch 404 and forward to error handler
//Defines a middleware function that catches any requests that do not match any previous routes. It creates a 404 error and passes it to the error handler.

app.use(function (req, res, next) {
    next(createError(404));
});
//Starts the server and listens on port 3000 for incoming HTTP requests.
app.listen(3000);