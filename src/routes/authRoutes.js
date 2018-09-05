const express = require('express');
const { MongoClient, ObjectID } = require('mongodb');
const debug = require('debug') ('app:authRoutes');
const passport = require('passport');

const authRouter = express.Router();

function router(message, nav) {
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

                    const results = await col.insertOne(user);
                    debug(results);

                    req.login(results.ops[0], () => {
                        res.redirect('/auth/profile');
                    });
                } catch (err) {
                    debug(err);
                }
            } ());           
        });
        
    authRouter.route('/signIn')
        .get((req, res) => {
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
    return authRouter;
}

module.exports = router;