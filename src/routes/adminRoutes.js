const express = require('express');

const debug = require('debug')('app:adminRoutes');
const adminRouter = express.Router();
const adminController = require('../controllers/adminController');

function router(message, nav) {
    const { middleware, insertMany } = adminController(message, nav);

    adminRouter.use(middleware);
    adminRouter.route('/')
        .get(insertMany);
    return adminRouter;
}

module.exports = router;