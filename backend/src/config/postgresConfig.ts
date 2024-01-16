import { Pool } from 'pg';


/**
 * Database connection pool configuration using the 'pg' library.
 * @type {Pool}
 */
export const pool: Pool = new Pool({
      /**
   * The hostname or IP address of the database server.
   * @type {string}
   * @description This should be the hostname or IP address of the PostgreSQL database server.
   *   Example: 'localhost'
   * @env DB_HOST
   */
    host: process.env.DB_HOST,
      /**
   * The port number to use for the database server.
   * @type {number}
   * @description This is the port number to connect to on the PostgreSQL database server.
   *   Example: 5432
   * @env DB_PORT
   */
    port: Number(process.env.DB_PORT),
      /**
   * The username used to authenticate with the database server.
   * @type {string}
   * @description This is the username used to authenticate with the PostgreSQL database server.
   * @env DB_USER
   */
    user: process.env.DB_USER,
      /**
   * The password used to authenticate with the database server.
   * @type {string}
   * @description This is the password used to authenticate with the PostgreSQL database server.
   * @env DB_PASSWORD
   */
    password: process.env.DB_PASSWORD,
      /**
   * The name of the database to connect to.
   * @type {string}
   * @description This is the name of the PostgreSQL database to connect to.
   * @env DB_DATABASE
   */
    database: process.env.DB_DATABASE
});


/**
 * Event listener for the 'error' event emitted by the database connection pool.
 * @event Pool#error
 * @param {Error} err - The error object emitted by the 'error' event.
 */
pool.on('error', (err) => {
    console.error('Database connection error:', err);
});