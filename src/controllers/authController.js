const debug = require('debug') ('app:authController');
const passport = require('passport');
const { MongoClient, ObjectID } = require('mongodb');

function adminController (message, nav) {
    function insertUser (req, res) {
        debug('********* CONTROLLER INSERT USER *********');
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
    }

    function renderSignIn (req, res) {
        debug('inside signin!!!******');
        res.render('signin', {
            nav,
            message,
            title: 'Sign In'
        });
    }

    function displayProfile (req, res) {
        res.json(req.user);
    }

    //currently NOT working when called from authRoutes. Please investigate!
    function passportAuth() {
        debug('****** INSIDE PASSPORTAUTH FUNC *******');
        try {
            passport.authenticate('local', {
                successRedirect: '/auth/profile',
                failureRedirect: '/'
            });
        }
        catch (err) {
            debug(err.stack);
        }
    }

    function middleware (req, res, next) {
        req.logout();
        next();
    }

    function renderLogout (req, res) {
        res.render('logout', {
            name: 'Test',
            nav
        });
    }

    return {
        insertUser,
        renderSignIn,
        passportAuth, //still not working!
        displayProfile,
        middleware,
        renderLogout
    };
}

module.exports = adminController;