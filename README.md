# Botmetrics Middleware for Botkit

[Botmetrics](https://www.getbotmetrics.com) is an analytics and
engagement platform for chatbots.

## Installation

Add `botkit-middleware-botmetrics` to your `package.json`

```
$ npm install --save botmetrics-botframework-middleware
```

## Usage

Register your bot with
[Botmetrics](https://getbotmetrics.com). Once you have done so, navigate to "Bot Settings" and find out your Bot ID and API Key.

Set the following environment variables with the Bot ID and API
Key respectively.

```
BOTMETRICS_BOT_ID=your-bot-id
BOTMETRICS_API_KEY=your-api-key
```

Require `botkit-middleware-botmetrics` and use the middleware in your bot like so:

```javascript
require('botkit-middleware-botmetrics')({
  botmetricsbotid: process.env.BOTMETRICS_BOT_ID,
  botmetricsapikey: process.env.BOTMETRICS_API_KEY,
  controller: controller
});
```

### Slack

For a detailed Slack example, look at
[examples/slack.js](examples/slack.js).

Set the appropriate environment variables `SLACK_BOT_TOKEN` and then run
`node examples/slack.js).

### Facebook

For a detailed Facebook example, look at
[examples/facebook.js](examples/facebook.js).

Set the appropriate environment variables `PAGE_ACCESS_TOKEN` and `VERIFY_TOKEN` and then run `node examples/slack.js).

## Setting your API Host (for Self-Hosting)

If you are using your own self-hosted version of Botmetrics, remember to
set the `BOTMETRICS_API_HOST` environment variable to your host (If you
have hosted your Botmetrics instance at
`https://my-botmetrics-instance.herokuapp.com`, set
`BOTMETRICS_API_HOST` to `https://my-botmetrics-instance.herokuapp.com`.

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/botmetrics/botmetrics.js. This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [Contributor Covenant](http://contributor-covenant.org) code of conduct.

## License

The gem is available as open source under the terms of the [MIT License](http://opensource.org/licenses/MIT).
