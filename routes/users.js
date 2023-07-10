var express = require('express');
var router = express.Router();
var dbConn = require('../lib/db');

// display user page
router.get('/', function (req, res, next) {
    dbConn.query('SELECT * FROM users ORDER BY id desc', function (err, rows) {
        if (err) {
            req.flash('error', err);
            // render to views/users/index.ejs
            res.render('users', { data: '' });
        } else {
            // render to views/users/index.ejs
            res.render('users', { data: rows });
        }
    });
});

// display add user page
router.get('/add', function (req, res, next) {
    // render to add.ejs
    res.render('users/add', {
        name: '',
        email: '',
        position: '',
        user_name: '',
        pass_word: ''
    })
})

// add a new user
router.post('/add', function (req, res, next) {

    let name = req.body.name;
    let email = req.body.email;
    let position = req.body.position;
    let user_name = req.body.user_name;
    let pass_word = req.body.pass_word;
    let errors = false;

    if (name.length === 0 || email.length === 0 || position === 0 || user_name === 0 || pass_word === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Please enter name and email and position and username and password");
        // render to add.ejs with flash message
        res.render('users/add', {
            name: name,
            email: email,
            position: position,
            user_name: user_name,
            pass_word: pass_word
        })
    }

    // if no error
    if (!errors) {

        var form_data = {
            name: name,
            email: email,
            position: position,
            user_name: user_name,
            pass_word: pass_word
        }

        // insert query
        dbConn.query('INSERT INTO users SET ?', form_data, function (err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)

                // render to add.ejs
                res.render('users/add', {
                    name: form_data.name,
                    email: form_data.email,
                    position: form_data.position,
                    user_name: user_name,
                    pass_word: pass_word
                })
            } else {
                req.flash('success', 'User successfully added');
                res.redirect('/users');
            }
        })
    }
})

// display edit user page
router.get('/edit/(:id)', function (req, res, next) {

    let id = req.params.id;

    dbConn.query('SELECT * FROM users WHERE id = ' + id, function (err, rows, fields) {
        if (err) throw err

        // if user not found
        if (rows.length <= 0) {
            req.flash('error', 'User not found with id = ' + id)
            res.redirect('/users')
        }
        // if user found
        else {
            // render to edit.ejs
            res.render('users/edit', {
                title: 'Edit User',
                id: rows[0].id,
                name: rows[0].name,
                email: rows[0].email,
                position: rows[0].position,
                user_name: rows[0].user_name,
                pass_word: rows[0].pass_word
            })
        }
    })
})

// update user data
router.post('/update/:id', function (req, res, next) {

    let id = req.params.id;
    let name = req.body.name;
    let email = req.body.email;
    let position = req.body.position;
    let user_name = req.body.user_name;
    let pass_word = req.body.pass_word;
    let errors = false;

    if (name.length === 0 || email.length === 0 || position.length === 0 || user_name.length === 0 || pass_word.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Please enter name and email and position");
        // render to add.ejs with flash message
        res.render('users/edit', {
            id: req.params.id,
            name: name,
            email: email,
            position: position,
            user_name: user_name,
            pass_word: pass_word
        })
    }

    // if no error
    if (!errors) {

        var form_data = {
            name: name,
            email: email,
            position: position,
            user_name: user_name,
            pass_word: pass_word
        }
        // update query
        dbConn.query('UPDATE users SET ? WHERE id = ' + id, form_data, function (err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // render to edit.ejs
                res.render('users/edit', {
                    id: req.params.id,
                    name: form_data.name,
                    email: form_data.email,
                    position: form_data.position,
                    user_name: form_data.user_name,
                    pass_word: form_data.pass_word
                })
            } else {
                req.flash('success', 'User successfully updated');
                res.redirect('/users');
            }
        })
    }
})

// delete user
router.get('/delete/(:id)', function (req, res, next) {

    let id = req.params.id;

    dbConn.query('DELETE FROM users WHERE id = ' + id, function (err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to user page
            res.redirect('/users')
        } else {
            // set flash message
            req.flash('success', 'User successfully deleted! ID = ' + id)
            // redirect to user page
            res.redirect('/users')
        }
    })
})

//login page 
// display login page
router.get('/login', function (req, res, next) {
    // render to add.ejs
    res.render('users/login', {
        user_name: '',
        pass_word: ''
    })
})

// login user
router.post('/login', function (req, res, next) {

    let user_name = req.body.user_name;
    let pass_word = req.body.pass_word;
    let errors = false;

    if (user_name === 0 || pass_word === 0) {
        errors = true;
        // set flash message
        req.flash('error', "Please enter name and email and position and username and password");
        // render to add.ejs with flash message
        res.render('users/login', {
            user_name: user_name,
            pass_word: pass_word
        })
    }

    // if no error
    if (!errors) {

        var form_data = {
            user_name: user_name,
            pass_word: pass_word
        }

        // insert query
        dbConn.query('SELECT * FROM users WHERE user_name = ? AND pass_word = ?', [user_name, pass_word], function (err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)

                // render to add.ejs
                res.render('users/login', {

                    user_name: user_name,
                    pass_word: pass_word
                })
            } else {
                if (result.length === 0) {
                    req.flash('error', 'Invalid username or password');
                    res.render('users/login', {
                        user_name: user_name,
                        pass_word: pass_word
                    });
                } else {
                    req.flash('success', 'User successfully logged in');//, { user_name }
                    res.redirect('/users/dashboard');
                }
            }
        })
    }
})

// display Dashboard page
//// "test": "echo \"Error: no test specified\" && exit 1"
router.get('/dashboard', function (req, res, next) {
    // render to add.ejs
    res.render('users/dashboard')
})

module.exports = router;