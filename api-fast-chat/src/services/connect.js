// Please note that if you changed the user, database, or password in the database creation section you will need to update the respective line items below.
const Pool = require('pg').Pool

const credentials = {
    user: 'docker',
    host: 'localhost',
    password: 'docker',
    database: 'docker',
    port: 5432,
}

console.log(credentials, 'conection')
const pool = new Pool(credentials)

module.exports = pool
