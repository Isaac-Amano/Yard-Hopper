/* the only line you likely need to change is

 database: 'prime_app',

 change `prime_app` to the name of your database, and you should be all set!
*/

const pg = require('pg');
let pool;

if (process.env.DATABASE_URL) {
    pool = new pg.Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });
}
else {
    pool = new pg.Pool({
        host: 'localhost',
        port: 5432,
        database: 'prime_app',   
    });
}

module.exports = pool;
