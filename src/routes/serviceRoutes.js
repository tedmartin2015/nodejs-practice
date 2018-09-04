const express = require('express');
const sql = require('mssql');
const { MongoClient, ObjectID } = require('mongodb');
const serviceRouter = express.Router();
const debug = require('debug')('app:serviceRoutes');

function router(message) {
  serviceRouter.route('/')
    .get((req, res) => {
      const url = 'mongodb://localhost:27017';
      const dbName = 'serviceApp';

      (async function mongo() {
          let client;
          try {
              client = await MongoClient.connect(url);
              const db = client.db(dbName);
              const col = await db.collection('services');
              const services = await col.find().toArray();
          
              res.render(
                'serviceListView',
                {
                  services
                }
              )
              client.close();
          }
          catch (err) {

            debug(err.stack);
          }       
      } ());
    });

  serviceRouter.route('/:id')
    /////test commit to new branch
    .get((req, res) => {
      const { id } = req.params;
      const url = 'mongodb://localhost:27017';
      const dbName = 'serviceApp';

      (async function mongo() {
        let client;
          try {
              client = await MongoClient.connect(url);
              const db = client.db(dbName);
              const col = await db.collection('services');

              const service = await col.findOne({ _id: new ObjectID(id)});
              res.render(
                'serviceView',
                {
                  service
                }
              );
          }
          catch (err) {
            debug(err.stack);
          }
      } ());     
    });

  return serviceRouter;
}

module.exports = router;
