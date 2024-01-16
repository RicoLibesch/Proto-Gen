require('dotenv').config();

/**
 * Configuration for LDAP (Lightweight Directory Access Protocol).
 * @typedef {Object} LdapConfig
 * @property {Object} ldap - LDAP configuration settings.
 * @property {string} ldap.url - The URL of the LDAP server.
 * @property {string} ldap.baseDN - The Base Distinguished Name (DN) for LDAP operations.
 * @property {Function} ldap.getBindDN - A function to generate the Bind Distinguished Name (DN) based on the username.
 *   @param {string} username - The username for which the Bind DN is generated.
 *   @returns {string} The generated Bind DN.
 */

/**
 * Configuration object for LDAP settings.
 * @type {LdapConfig}
 */
export const ldapConfig = {
  ldap: {
        /**
     * The URL of the LDAP server.
     * @type {string}
     * @description This should be the URL of the LDAP server you want to connect to.
     *   Example: 'ldap://ldap.example.com:389'
     * @env LDAP_URL
     */
    url: process.env.LDAP_URL,
        /**
     * The Base Distinguished Name (DN) for LDAP operations.
     * @type {string}
     * @description The base DN is a reference point for all LDAP operations.
     *   Example: 'ou=users,dc=example,dc=com'
     * @env BASE_DN
     */
    baseDN: process.env.BASE_DN,
        /**
     * A function to generate the Bind Distinguished Name (DN) based on the username.
     * @function
     * @name getBindDN
     * @memberof LdapConfig.ldap
     * @param {string} username - The username for which the Bind DN is generated.
     * @returns {string} The generated Bind DN.
     * @description This function takes a username as a parameter and generates the Bind DN.
     *   Example: (username) => `uid=${username},ou=users,dc=example,dc=com`
     */
    getBindDN: (username) => `uid=${username},${process.env.BIND_DN}`,
  },
};