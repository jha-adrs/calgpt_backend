const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { logger } = require('./utils/logger');
require('dotenv').config();
const { pool, instantiatePool, query } = require('./utils/mysql')
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
var session = require('express-session');

const app = express();

// Middleware
app.use(helmet());
app.use(bodyParser.json()); // parse json request body
app.use(bodyParser.urlencoded({ extended: true })); // parse urlencoded request body
app.use(morgan('combined', { stream: logger.stream })); // HTTP request logger

// apply rate limiter to all requests
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

const mysqlStore = require('express-mysql-session')(session);
//const sessionStore = new mysqlStore(globalThis.pool);
const sessionStore = new mysqlStore({
    connectionLimit: 2,
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: 'calgpt',

});
// TODO Configure session store
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24  // 1 day for now
        },
        store: sessionStore,
    })
)

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
//Middle ware to log request endpoint
app.use((req, res, next) => {
    logger.info('Request endpoint', req.originalUrl);
    next();
});



app.get('/', (req, res) => {
    res.send('<a href="/auth/google">Hello World!</a>').status(200);
});

app.get('/ping', (req, res) => {
    res.send('pong').status(200);
});

app.use('/auth', require('./routes/auth'))

// Auth routes
app.use(passport.initialize());
app.use(passport.session());

app.get('/logout', require('./controllers/user/logout'));
app.use('/user', require('./routes/user'));

// Not Found




app.listen(
    process.env.PORT || 5000,
    async () => {
        logger.info(`Server is running on port: ${process.env.PORT || 5000}`)
        await instantiatePool();
    }
)