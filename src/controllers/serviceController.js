const debug = require('debug')('app:serviceController');
const { MongoClient, ObjectID } = require('mongodb');

function serviceController(message) {
    function getIndex (req, res) {
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
                );
                client.close();
            }
            catch (err) {
                debug(err.stack);
            } 
            client.close();      
        } ());
    }

    function getById (req, res) {
        debug('INSIDE GETBYID! WOOOHOOOOOO!')
        const url = 'mongodb://localhost:27017';
        const dbName = 'serviceApp';
        const { id } = req.params;

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
            client.close();
        } ());  
    }

    return {
        getIndex,
        getById
    };
}

module.exports = serviceController;