require('dotenv').config();


/**
 * Configuration for email settings.
 * @typedef {Object} MailConfig
 * @property {string} host - The hostname or IP address of the email server.
 * @property {number} port - The port number to use for the email server.
 * @property {Object} auth - Authentication details for the email server.
 * @property {string} auth.user - The username for authenticating with the email server.
 * @property {string} auth.pass - The password for authenticating with the email server.
 */

/**
 * Configuration object for email settings.
 * @type {MailConfig}
 */
export const mailConfig = {
    /**
   * The hostname or IP address of the email server.
   * @type {string}
   * @description This should be the hostname or IP address of the email server you want to connect to.
   *   Example: 'smtp.example.com'
   * @env EMAIL_HOST
   */
  host: process.env.EMAIL_HOST,
    /**
   * The port number to use for the email server.
   * @type {number}
   * @description This is the port number to connect to on the email server.
   *   Example: 587
   * @env EMAIL_PORT
   */
  port: process.env.EMAIL_PORT,
    /**
   * Authentication details for the email server.
   * @type {Object}
   */
  auth: {
        /**
     * The username for authenticating with the email server.
     * @type {string}
     * @description This is the username used to authenticate with the email server.
     * @env EMAIL_USER
     */
    user: process.env.EMAIL_USER,
        /**
     * The password for authenticating with the email server.
     * @type {string}
     * @description This is the password used to authenticate with the email server.
     * @env EMAIL_PASS
     */
    pass: process.env.EMAIL_PASS,
  },
};