const express = require('express');
const { MongoClient, ObjectID } = require('mongodb');
const debug = require('debug') ('app:authRoutes');
const passport = require('passport');

const authRouter = express.Router();
const authController = require('../controllers/authController');

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
    const { insertUser, renderSignIn, displayProfile, middleware, renderLogout } = authController(message, nav);

    authRouter.route('/signUp')
        .post(insertUser);

    authRouter.route('/signIn')
        .get(renderSignIn)
        .post(passport.authenticate('local', {
            successRedirect: '/auth/profile',
            failureRedirect: '/'
        }));

    authRouter.route('/profile')
        .get(displayProfile);

    authRouter.route('/logout')
        .all(middleware)
        .get(renderLogout);
            
    return authRouter;
}

module.exports = router;