const passport = require('passport');
const { Strategy } = require('passport-local');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app.local.strategy');

module.exports = () => {
    passport.use(new Strategy({
        usernameField: 'username',
        passwordField: 'password'
    }, (username, password, done) => {
        //validate here...
        const url = 'mongodb://localhost:27017';
        const dbName = 'serviceApp';

        (async function mongo() {
            let client;
            try {
                client = await MongoClient.connect(url);
                const db = client.db(dbName);
                const col = db.collection('users');

                const user = await col.findOne({ username });
                
                if (user.password === password) {
                    done(null, user);
                }
                else {
                    done(null, false);
                }
            } catch (err) {
                debug(err);
            }
        } ());           
    }));
};