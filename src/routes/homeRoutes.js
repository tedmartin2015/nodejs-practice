const express = require('express');
const homeRouter = express.Router();
const homeController = require('../controllers/homeController');
const debug = require('debug')('app:homeRoutes');


module.exports = (message) => {
    const { redirectToIndex } = homeController(message);
    homeRouter.route('/')
        .get(redirectToIndex);
   
    return homeRouter;
}