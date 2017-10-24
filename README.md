# slack-transport
Slack transport for Winston >= 3.0

### Inspiration
I'm a big fan of `winston-slack-webhook` so I took inspiration from that setup.

## Instalation

```
$ npm install slack-transport
```

## Usage

```
const { createLogger, format, transports } = require('winston'),
      { SlackTransport } = require('slack-transport')

let slackTransport = new SlackTransport({ level: 'error',
  webhook: 'path-to-your-webhook',
  channel: '#channel-name',
  username: 'Reporter',
  iconEmoji:':alert:'
})

const logger = createLogger({
  level:'info',
  format: format.json(),
  transports: [slackTransport]
})

logger.error("AN ERROR OCCURRED")

```
