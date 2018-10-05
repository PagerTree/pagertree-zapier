/* globals describe it */
const should = require('should');

const zapier = require('zapier-platform-core');

const debug = require('debug')('pt:test:resources:broadcast');
const jwt = require('jsonwebtoken');

// Use this to make test calls into your app:
const App = require('../../index');
const appTester = zapier.createAppTester(App);
zapier.tools.env.inject();

describe('My App', () => {
  it('should run resources.broadcast', done => {
    const bundle = {
      authData: global.authData,
      inputData: {
        message: "Test broadcast from Zapier",
        user_ids: jwt.decode(global.authData.sessionKey).id
      }
    };

    appTester(App.resources.broadcast.create.operation.perform, bundle)
      .then(result => {
        debug(`create broadcast result %O`, result);
        should.exist(result);
        done();
      })
      .catch(done);
  });
});
