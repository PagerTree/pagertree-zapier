const TeamResource = require('./resources/team');
const UserResource = require('./resources/user');
const IncidentResource = require('./resources/incident');
const BroadcastResource = require('./resources/broadcast');
const authentication = require('./authentication');

const debug = require('debug')('pt:index');
const _ = require('lodash');

// To include the session key header on all outbound requests, simply define a function here.
// It runs runs before each request is sent out, allowing you to make tweaks to the request in a centralized spot
const includeSessionKeyHeader = (request, z, bundle) => {
  debug(`includeSessionKeyHeader`)
  if (bundle.authData.sessionKey) {
    debug(`includeSessionKeyHeader %O`, bundle.authData.sessionKey);
    request.headers = request.headers || {};
    request.headers['authorization'] = `Bearer ${bundle.authData.sessionKey}`;
  }
  return request;
};

// If we get a response and it is a 401, we can raise a special error telling Zapier to retry this after another exchange.
const sessionRefreshIf401 = (response, z, bundle) => {
  debug(`sessionRefreshIf401`);
  if (bundle.authData.sessionKey) {
    debug(`sessionRefreshIf401 sessionKey %O`, bundle.authData.sessionKey);
    if (response.status === 401) {
      throw new z.errors.RefreshAuthError('Session key needs refreshing.');
    }
  }
  return response;
};

const checkFor400Errors = (response, z, bundle) => {
  if(response.status === 400){
    var errors = _.get(response.json, "errors", null);
    if(errors){
      throw new Error('Bad Request', errors);
    }
  }
  return response;
}

// We can roll up all our behaviors in an App.
const App = {
  // This is just shorthand to reference the installed dependencies you have. Zapier will
  // need to know these before we can upload
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,

  authentication: authentication,

  // beforeRequest & afterResponse are optional hooks into the provided HTTP client
  beforeRequest: [
    includeSessionKeyHeader
  ],

  afterResponse: [
    sessionRefreshIf401,
    checkFor400Errors,
  ],

  // If you want to define optional resources to simplify creation of triggers, searches, creates - do that here!
  resources: {
    [TeamResource.key]: TeamResource,
    [UserResource.key]: UserResource,
    [IncidentResource.key]: IncidentResource,
    [BroadcastResource.key]: BroadcastResource,
  },

  // If you want your trigger to show up, you better include it here!
  triggers: {
  },

  // If you want your searches to show up, you better include it here!
  searches: {
  },

  // If you want your creates to show up, you better include it here!
  creates: {
  }
};

// Finally, export the app.
module.exports = App;
