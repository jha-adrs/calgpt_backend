// Create a cache pool for mysql
var mysql = require('mysql2');
const { logger } = require('./logger');
require('dotenv').config();
let pool;

const instantiatePool = async() => {
    if (!pool) {
        globalThis.pool = await mysql.createPool({
            connectionLimit: 2,
            host: process.env.DATABASE_HOST,
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: 'calgpt',
        
        })
        globalThis.pool.getConnection((err, connection) => {
            if (err) {
                // handle error
                logger.error('Error connecting to database', err);
                return;
            }
            connection.release();
            logger.info('Connected to mysql database');
        });
    }
    return globalThis.pool;
}

const query = async (sql, params) => {
    let pool;
    if(globalThis.pool){
        logger.info('Using global pool');
        pool = globalThis.pool
    }
    else{
        pool = instantiatePool();
    }
    logger.info('Querying mysql database, QUERY', sql, 'PARAMS', params );
    if(!params){
        params = [];
    }
    return new Promise((resolve, reject) => {
        pool.getConnection(async(err, connection) => {
            if(err){
                logger.error(err);
            }
            if(!connection){
                logger.error('No connection');
            }
            
    
            connection.query(sql, params, (err, rows) => {
                connection.release();
                if (err) {
                    logger.error(err)
                } else {
                    resolve(rows);
                }
            });
            
        });
    })
}

module.exports = {
    pool,
    query,
    instantiatePool
}