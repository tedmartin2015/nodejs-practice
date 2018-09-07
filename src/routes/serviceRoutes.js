const express = require('express');
const serviceRouter = express.Router();
const serviceController = require('../controllers/serviceController');
const bookService = require('../services/goodreadsService');

function router(message) {
  const { getIndex, getById } = serviceController(bookService, message);
  serviceRouter.route('/')
    .get(getIndex);

  serviceRouter.route('/:id')
    .get(getById);

  return serviceRouter;
}

module.exports = router;