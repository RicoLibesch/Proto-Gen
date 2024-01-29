const ldap = require('ldapjs');
const users = require('./users'); //Test users
const server = ldap.createServer();
const password = "test"; //Password for every user
const validation = require('./validation'); //Validate test users

server.listen(1389, 'protogen_ldap', () => {
  validation.validateUsers(users, password);
  console.log('LDAP server listening at %s', server.url);
});

// Authenticate User
server.bind('', (req, res, next) => {
  const user = users.find(user => user.dn === req.dn.toString());

  if (!user || req.credentials !== password) {
    return next(new ldap.InvalidCredentialsError());
  }

  res.end();
  return next();
});

// Find User
server.search('', (req, res, next) => {
  users.forEach(user => {
    if (req.filter.matches(user.attributes)) {
      res.send({
        dn: user.dn,
        attributes: user.attributes
      });
    }
  });

  res.end();
  return next();
});