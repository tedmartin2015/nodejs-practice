const express = require('express');
const sql = require('mssql');
const { MongoClient } = require('mongodb');
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
    //test commit to new branch
    .all((req, res, next) => {
      (async function query() {
        const { id } = req.params;
        const request = new sql.Request();
        const { recordset } = await request
          .input('xServiceID', sql.Int, id)
          .execute('dbo.pSELECTServicesByID');

        [req.service] = recordset;
        next();
      } ());
    })
    .get((req, res) => {
      res.render(
        'serviceView',
        {
          service: req.service
        }
      );
    });

  return serviceRouter;
}

module.exports = router;
