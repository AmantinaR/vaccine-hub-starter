const { RowDescriptionMessage } = require('pg-protocol/dist/messages');

require('dotenv').config();
require('colors');

const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;

function getDatabaseUri() {
    const dbUser = process.env.DATABASE_USER || "postgres";
    const dbPass = process.env.DATABASE_PASS ? encodeURI(process.env.DATABASE_PASS) : "postgres";
    const dbHost = process.env.DATABASE_HOST || "localhost";
    const dbPort = process.env.DATABASE_PORT || 5432;
    const dbName = process.env.DATABASE_NAME || "vaccine_hub";

    //if DATABASE_URL envir variable, use that
    //otherwise create connection
    return process.env.DATABASE_URL || `postgres://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}`;

    
}

console.log("process.env".yellow, Object.keys(process.env))
console.log("App Config".red)
console.log("PORT:".blue, PORT)
console.log("Database URI:".blue, getDatabaseUri())
console.log("---") 

module.exports = {
    PORT, 
    getDatabaseUri
}