const express = require('express');
const homeRouter = express.Router();
const debug = require('debug')('app:homeRoutes');

module.exports = (message) => {
    homeRouter.route('/')
        .get((req, res) => {
            res.redirect('/');
        });
   
    return homeRouter;
}