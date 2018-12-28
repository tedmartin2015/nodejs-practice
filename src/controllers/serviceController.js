const debug = require('debug')('app:serviceController');
const axios = require('axios');

function serviceController(bookService, message) {
    function getIndex (req, res) {
        const url = 'mongodb://localhost:27017';
        const dbName = 'serviceApp';

        (async function mongo() {
            try { 
                axios({
                    method: "GET",
                    url: "http://localhost:5003/services",
                    responseType: "json"
                })
                .then((response) => {
                    res.render(
                        'serviceListView',
                        {
                            services: response.data
                        }
                    );
                })
                .catch((err) => {
                    debug(err.stack);
                });
            }
            catch (err) {
                debug(err.stack);
            } 
        } ());
    }

    function getById (req, res) {
        debug('INSIDE GETBYID! WOOOHOOOOOO!')
        const url = 'mongodb://localhost:27017';
        const dbName = 'serviceApp';
        const { id } = req.params;

        axios({
            method: "GET",
            url: `http://localhost:5003/services/${id}`,
            responseType: "json"
        })
        .then((response) => {
            (async function mongo() {
                const service = response.data;
                service.details = await bookService.getBookById(service.bookId);
                res.render(
                    'serviceView',
                    {
                        service
                    }
                );
            } ());
            
        })
        .catch((err) => {
            debug(err.stack);
        });

    }

    return {
        getIndex,
        getById
    };
}

module.exports = serviceController;