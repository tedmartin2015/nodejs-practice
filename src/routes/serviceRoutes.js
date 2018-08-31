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
    //test
    .get((req, res) => {
      (async function query() {
        const { id } = req.params;
        const request = new sql.Request();
        const { recordset } = await request
          .input('xServiceID', sql.Int, id)
          .execute('dbo.pSELECTServicesByID');
        res.render(
          'serviceView',
          {
            service: recordset[0]
          }
        );
      } ());


    });

  return serviceRouter;
}



module.exports = router;
