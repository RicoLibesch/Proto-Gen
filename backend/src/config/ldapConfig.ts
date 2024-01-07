require('dotenv').config();

export const ldapConfig = {
  ldap: {
    url: process.env.LDAP_URL,
    baseDN: process.env.BASE_DN,
    getBindDN: (username) => `uid=${username},${process.env.BIND_DN}`,
  },
};