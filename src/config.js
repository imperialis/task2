require('dotenv').config();
module.exports = {
  secret: process.env.SECRET ,
  jwtSecret: process.env.JWT_SECRET,
  development: {
    username: process.env.DB_USERNAME ,
    password: process.env.DB_PASSWORD ,
    database: process.env.DB_NAME ,
    host: process.env.DB_HOST ,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    //dialectOptions: {
      //ssl: { rejectUnauthorized: false } // Only if your PostgreSQL instance requires SSL
    //}
  }
};
