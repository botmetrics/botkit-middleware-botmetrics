var chai = require('chai');
var sinon = require('sinon');
var nock = require('nock');
var Facebook = require('../src/facebook');

chai.use(require('sinon-chai'));
expect = chai.expect;

describe('Facebook without creds', function() {
  context('botId is not present', function(){
    it('should throw an error', function(done) {
      expect(Facebook.bind(null, { appKey: 'app-key' })).to.throw('No bot id or api key specified');
      done()
    })
  });

  context('appKey is not present', function(){
    it('should throw an error', function(done) {
      expect(Facebook.bind(null, { botId: 'bot-id' })).to.throw('No bot id or api key specified');
      done()
    })
  })
})

describe('Facebook with creds', function() {
  it('should not throw an error', function(done) {
    expect(Facebook.bind(null, { botId: 'bot-id', apiKey: 'api-key' })).to.not.throw('No bot id or api key specified');
    done()
  })

})

describe('.receive', function() {
  var eventToTrack = {
        name: 'event-name',
        timestamp: '123456789.0'
      },
      facebook,
      message,
      statusCode,
      params,
      facebookHookResponse;

  beforeEach(function() {
    facebook = Facebook({
      botId: 'bot-id',
      apiKey: 'api-key'
    });

    message = {
        text: 'text',
        user: 'user-id',
        channel: 'channel-id',
        timestamp: 'timestamp',
        seq: 'seq',
        mid: 'mid',
        sticker_id: 'sticker-id',
        attachments: 'attachments',
        quick_reply: 'quick-reply'
    };

    facebookHookResponse = {
      object: 'page',
      entry: [{
        messaging: [{
          sender: {
            id: message.user
          },
          timestamp: message.timestamp,
          message: {
            text: message.text,
            mid: message.mid,
            seq: message.seq,
            attachments: message.attachments
          }
        }]
      }]
    };

    params = JSON.stringify({ event: JSON.stringify(facebookHookResponse), format: 'json' })

    scope = nock('http://localhost:3000', {
      reqheaders: {
        'Authorization': 'api-key',
        'Content-Type': 'application/json'
      }
    })
    .post('/bots/bot-id/events', params)
    .reply(statusCode);
  });

  context('API returns correct status code', function() {
    before(function() {
      statusCode = 202;
    });

    it('should make a call to the Botmetrics API sending a message', function(done) {
      facebook.receive(null, message, function(err) {
        expect(err).to.be.undefined;
        expect(scope.isDone()).to.be.true;
        done();
      });
    });
  });

  context('API returns incorrect status code', function() {
    before(function() {
      statusCode = 401;
    });

    it('should make a call to the Botmetrics API sending a message', function(done) {
      facebook.receive(null, message, function(err) {
        expect(err).to.be.present;
        expect(scope.isDone()).to.be.true;
        done();
      });
    });
  });
});
