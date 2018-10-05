const debug = require('debug')('pt:authentication');
const _ = require('lodash');
const jwt = require('jsonwebtoken');

const testAuth = (z, bundle) => {
  debug(`testAuth`);
  // This method can return any truthy value to indicate the credentials are valid.
  // Raise an error to show
  var jwt_data = jwt.decode(bundle.authData.sessionKey);
  return z.request({
      url: `https://api.pagertree.com/user/${jwt_data.id}`,
    }).then((response) => {
      if (response.status === 401) {
        throw new Error('The Session Key you supplied is invalid');
      }

      return response;
    });
};

const getSessionKey = (z, bundle) => {
  debug(`getSessionKey username %O`, bundle.authData.username);
  const promise = z.request({
    method: 'POST',
    url: 'https://api.pagertree.com/public/login',
    body: {
      username: bundle.authData.username,
      password: bundle.authData.password,
    }
  });

  return promise.then((response) => {
    if(response.status === 200){
      const json = z.JSON.parse(response.content);
      return {
        sessionKey: json.token
      };
    } else if(response.status === 400){
      throw new Error(_.get(response.json, "errors.0.message"));
    } else if (response.status === 422) {
      throw new Error('The username/password you supplied is invalid');
    } else if (response.status === 429) {
      throw new Error(_.get(response.json, "errors.0.message"));
    } else {
      throw new Error(`Unknown error occured`, respone);
    }
  });
};

module.exports = {
  type: 'session',
  // Define any auth fields your app requires here. The user will be prompted to enter this info when
  // they connect their account.
  fields: [
    {key: 'username', label: 'Username', required: true, type: 'string'},
    {key: 'password', label: 'Password', required: true, type: 'password'}
  ],
  // The test method allows Zapier to verify that the credentials a user provides are valid. We'll execute this
  // method whenver a user connects their account for the first time.
  test: testAuth,
  // The method that will exchange the fields provided by the user for session credentials.
  sessionConfig: {
    perform: getSessionKey
  },
  // assuming "username" is a key returned from the test
  connectionLabel: '{{email}}'
};
