const debug = require('debug') ('app:adminController');
const { MongoClient } = require('mongodb');
const services = [
    {
        servicesid: 1,
        name: 'Delivery and Logistics',
        provider: 'Sophia Angela Hermosisima',
        bookId: 619041
    },
    {
        servicesid: 2,
        name: 'Customer Service',
        provider: 'Zecharia Barriga',
        bookId: 2146097
    },
    {
        servicesid: 3,
        name: 'Costing and Estimates',
        provider: 'Ted Martin Hermosisima',
        bookId: 377494
    },
    {
        servicesid: 4,
        name: 'Supplier Relations',
        provider: 'Melanie Hermosisima',
        bookId: 2146370
    },
    {
        servicesid: 5,
        name: 'Expansion and Acquisition',
        provider: 'Melanie Hermosisima',
        bookId: 5002
    },
    {
        servicesid: 6,
        name: 'Information Evangelist',
        provider: 'Melanie Hermosisima',
        bookId: 78250
    },
    {
        servicesid: 7,
        name: 'IT Administrator',
        provider: 'Zecharia Barriga',
        bookId: 2429135
    }];

function adminController(message, nav) {
    function middleware(req, res, next) {
        if (req.user.username === 'ted') {
            next();
        }
        else {
            res.render('index', {
                nav,
                title: 'Library',
                message: 'You are not authorized to insert records to the database.'
            });
        }
    }

    function insertMany(req, res) {
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
    }

    return {
        middleware,
        insertMany
    };
}

module.exports = adminController;