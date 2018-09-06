const express = require('express');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:adminRoutes');
const adminRouter = express.Router();
const services = [
    {
        servicesid: 1,
        name: 'Delivery and Logistics',
        provider: 'Sophia Angela Hermosisima'
    },
    {
        servicesid: 2,
        name: 'Customer Service',
        provider: 'Zecharia Barriga'
    },
    {
        servicesid: 3,
        name: 'Costing and Estimates',
        provider: 'Ted Martin Hermosisima'
    },
    {
        servicesid: 4,
        name: 'Supplier Relations',
        provider: 'Melanie Hermosisima'
    },
    {
        servicesid: 5,
        name: 'Expansion and Acquisition',
        provider: 'Melanie Hermosisima'
    },
    {
        servicesid: 6,
        name: 'Information Evangelist',
        provider: 'Melanie Hermosisima'
    },
    {
        servicesid: 7,
        name: 'IT Administrator',
        provider: 'Zecharia Barriga'
    }];

function router(message) {
    
    adminRouter.use((req, res, next) => {
        if (req.user.username === 'ted') {
            next();
        }
        else {
            res.redirect('/');
        }
    });
    adminRouter.route('/')
        .get((req, res) => {
            const url = 'mongodb://localhost:27017';
            const dbName = 'serviceApp';

            (async function mongo() {
                let client;
                try {
                    client = await MongoClient.connect(url);
                    debug('Connected correctly to the server');

                    const db = client.db(dbName);

                    const response = await db.collection('services').insertMany(services);
                    res.json(response);
                } catch (err) {
                    debug(err.stack);
                }

                client.close();
            } ());
        });
    return adminRouter;
}

module.exports = router;