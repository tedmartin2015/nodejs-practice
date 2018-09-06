const express = require('express');
const serviceRouter = express.Router();
const serviceController = require('../controllers/serviceController');

function router(message) {
  const { getIndex, getById } = serviceController(message);
  serviceRouter.route('/')
    .get(getIndex);

  serviceRouter.route('/:id')
    .get(getById);

  return serviceRouter;
}

module.exports = router;