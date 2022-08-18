require('dotenv').config();

const env = process.env;

module.exports = {
    DB : 'smartpapering',
    USER : env.DB_USER,
    PASSWORD : env.DB_PASSWORD,
    dialect : 'mysql',
    host : env.DB_HOST,
    port : 3000
}