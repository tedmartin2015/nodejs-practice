const express = require('express');
const sql = require('mssql');
const serviceRouter = express.Router();
const debug = require('debug')('app:serviceRoutes');

function router(message) {
  serviceRouter.route('/')
    .get((req, res) => {
      (async function query() {
        const request = new sql.Request();
        const { recordset } = await request.execute('dbo.pSELECTServices');

        res.render(
          'serviceListView',
          {
            services: recordset
          }
        )
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
