require('dotenv').config();

require('should');

const debug = require('debug')('pt:test:index');

const zapier = require('zapier-platform-core');

// Use this to make test calls into your app:
const App = require('../index');
const appTester = zapier.createAppTester(App);

describe('My App', () => {

  it('should test something', (done) => {
    const x = 1;
    x.should.eql(1);
    done();
  });

  it('has an exchange for username/password', (done) => {
    // Try changing the values of username or password to see how the test method behaves
    const bundle = {
      authData: {
        username: process.env.PT_AUTH_USERNAME,
        password: process.env.PT_AUTH_PASSWORD
      }
    };

    appTester(App.authentication.sessionConfig.perform, bundle)
      .then((newAuthData) => {
        newAuthData.sessionKey.should.be.a.String();
        global.authData = newAuthData;
        done();
      })
      .catch(done);
  });

  it('has auth details added to every request', (done) => {
    const bundle = {
      authData: global.authData
    };
    appTester(App.authentication.test, bundle)
      .then((response) => {
        response.status.should.eql(200);
        response.request.headers['authorization'].should.startWith('Bearer');
        done();
      })
      .catch(done);
  });

});
