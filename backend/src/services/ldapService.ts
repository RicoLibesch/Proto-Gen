require("dotenv").config();
import ActiveDirectory from 'activedirectory2';
import { User } from '../models/userModel';

export const authenticateUser = async (username: string, password: string): Promise<User> => {
  try {
    var config = { url: 'ldaps://ldap.fh-giessen.de',
                baseDN: 'ou=People,ou=MNI,ou=Giessen,dc=fh-giessen-friedberg,dc=de',
                bindDN: `uid=${username},ou=People,ou=MNI,ou=Giessen,dc=fh-giessen-friedberg,dc=de`,
                password: password
              }
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