const mysql = require("mysql2");

// Create a pool of database connections
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "password",
  database: "service_provider_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Promisify the query method
const queryAsync = (sql, values) => {
  return new Promise((resolve, reject) => {
    pool.execute(sql, values, (error, results) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(results);
    });
  });
};

module.exports = {
  queryAsync,
  pool,
};
