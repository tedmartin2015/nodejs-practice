const debug = require('debug') ('app:homeController');

module.exports = function homeController (message) {
    function redirectToIndex (req, res) {
        res.redirect('/');
    }
    return {
        redirectToIndex
    };
}