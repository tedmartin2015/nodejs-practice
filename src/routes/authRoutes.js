const express = require('express');
const { MongoClient, ObjectID } = require('mongodb');
const debug = require('debug') ('app:authRoutes');
const passport = require('passport');

const authRouter = express.Router();

function router(message, nav) {
    // authRouter.use((req, res, next) => {
    //     //can use req.user.roles or req.user.isadmin depending on what you put in the db
    //     if (req.user) {
    //         next();
    //     }
    //     else {
    //         res.redirect('/');
    //     }
    // });
    authRouter.route('/signUp')
        .post((req, res) => {
            //create user
            const { username, password } = req.body;
            const url = 'mongodb://localhost:27017';
            const dbName = 'serviceApp';

            (async function addUser() {
                let client;
                try {
                    client = await MongoClient.connect(url);
                    debug('ADD USER - Connected to the db server');
                    const db = client.db(dbName);
                    const col = db.collection('users');
                    const user = { username, password };

                    //check if inputted user already exists!
                    const checkUser = await col.findOne({ username: user.username });

                    if (!checkUser) {
                        const results = await col.insertOne(user);
                        debug(results);

                        req.login(results.ops[0], () => {
                            res.redirect('/auth/profile');
                        });
                    } 
                    else {
                        //redirect to sign in page with message informing the user that the inputted username already exists.
                        res.render('signin', {
                            nav,
                            message: 'The username you are trying to register already exists',
                            title: 'Sign In'
                        });
                    }                    
                } catch (err) {
                    debug(err);
                }
                client.close();
            } ());           
        });

    authRouter.route('/signIn')
        .get((req, res) => {
            debug('inside signin!!!******');
            res.render('signin', {
                nav,
                message,
                title: 'Sign In'
            });
        })
        .post(passport.authenticate('local', {
            successRedirect: '/auth/profile',
            failureRedirect: '/'
        }));

    authRouter.route('/profile')
        .get((req, res) => {
            res.json(req.user);
        });

    authRouter.route('/logout')
        .all((req, res, next) => {
            req.logout();
            next();
        })
        .get((req, res) => {
            res.render('logout', {
                name: 'Test',
                nav
            });
        });
            
    return authRouter;
}

module.exports = router;