const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { logger } = require('./utils/logger');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet()); // helps secure Express apps by setting various HTTP headers
app.use(bodyParser.json()); // parse json request body
app.use(bodyParser.urlencoded({ extended: true })); // parse urlencoded request body
app.use(morgan('combined', {stream: logger.stream})); // HTTP request logger

// apply rate limiter to all requests
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.get('/ping', (req, res) => {
    res.send('pong').status(200);
});


app.listen(
    process.env.PORT || 5000,
    () => console.log(`Listening on port ${process.env.PORT}!`)
)