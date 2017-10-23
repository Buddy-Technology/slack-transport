const Transport = require('winston-transport'),
      fetch     = require('node-fetch'),
      util      = require('util'),
      https     = require('https'),
      url       = require('url')

const defaultOptions = {
                          name:     'SlackTransport',
                          level:    'info',
                          iconEmoji:':wave:',
                        }

module.exports.SlackTransport = class SlackTransport extends Transport {
  constructor(opts) {

    if(!opts.webhook){
      throw new Error("webhook is required")
    }

    const options = Object.assign({},defaultOptions,opts)

    super(options)

  }

  async log(info, callback){

    setImmediate( () => {
      this.emit('logged', info)
    })

    const body = JSON.stringify(info),
          url = this.webhook,
          props = {
                    method:'post',
                    body: body,
                    headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                                'Content-Length': Buffer.byteLength(props.body)
                              }
                  }

    try{
      const slackResponse = await fetch(url, props)
    }catch(err){
      callback(err)
      return
    }
    callback(null, slackResponse)

  }
}
