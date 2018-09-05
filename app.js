const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');
// const sql = require('mssql');
const bodyParser = require('body-parser');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();
const port = process.env.PORT || 3000;
const message = 'This is a dud. Used to demo passing info to routes';

const nav = ['home', 'services', 'portfolio', 'about'];

// const config = {
//     user: 'ted',
//     password: 'Welcome@1x',
//     server: 'ted-hermosisima.database.windows.net', // You can use 'localhost\\instance' to connect to named instance
//     database: 'Ted-Hermosisima',

//     options: {
//         encrypt: true // Use this if you're on Windows Azure
//     }
// };

// sql.connect(config).catch(err => debug(err));

app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(cookieParser());
app.use(session({ secret: 'library'}));

//passport stuff
require('./src/config/passport.js')(app);

app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/jquery/dist')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/popper.js/dist')));
app.set('views', './src/views');
app.set('view engine', 'ejs');

const servicesRouter = require('./src/routes/serviceRoutes') (message);
const adminRouter = require('./src/routes/adminRoutes') (message);
const authRouter = require('./src/routes/authRoutes') (message, nav);

app.use('/services', servicesRouter);
app.use('/admin', adminRouter);
app.use('/auth', authRouter);

app.get('/', (req, res) => {
  //res.sendFile(path.join(__dirname, 'views', 'index.html'));
  res.render('index',
    {
      nav,
      title: 'Library'
    });
});

app.listen(port, () => {
  debug(`${chalk.red('#########')}
   listening on port ${chalk.green(port)} ${chalk.red('#########')}`);
});
