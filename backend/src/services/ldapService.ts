require("dotenv").config();
import ActiveDirectory from 'activedirectory2';
import { User } from '../models/userModel';
import { ldapConfig } from '../config/ldapConfig';

export const authenticateUser = async (username: string, password: string): Promise<User> => {
  try {
    const config = {
      url: ldapConfig.ldap.url,
      baseDN: ldapConfig.ldap.baseDN,
      bindDN: ldapConfig.ldap.getBindDN(username),
      bindCredentials: password,
    };
    const activeDirectory = new ActiveDirectory(config);

    const auth = await new Promise<boolean>((resolve, reject) => {
      activeDirectory.authenticate(config.bindDN, password, (err, auth) => {
        if (err) {
          if(err.message === "Invalid Credentials") {
            reject(new Error('Invalid Credentials'));
          } else {
            console.log(`LDAP Connection failed: ${err}`);
            reject(new Error('LDAP Connection Error'));
          }
        } else {
          resolve(auth);
        }
      });
    });

    const user = await new Promise<any>((resolve, reject) => {
      const query = `uid=${username}`;
      activeDirectory.find(query, (findErr, user) => {
        if (findErr) {
          console.log(`Unable to find user ${username}: ${findErr}`);
          reject(new Error('LDAP Find Error'));
        } else {
          resolve(user);
        }
      });
    });
    return new User(username, user.other[0].givenName, user.other[0].sn, user.other[0].displayName, user.other[0].mail);
  } catch (err) {
    if(err.message === "Invalid Credentials") {
      throw new Error("Invalid Credentials");
    }
    throw new Error('LDAP Auth failed');
  }
};