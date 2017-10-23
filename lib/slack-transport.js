const Transport = require('winston-transport'),
      fetch     = require('node-fetch'),
      util      = require('util'),
      https     = require('https'),
      url       = require('url')

const defaultOptions = {
                          name:         'SlackTransport',
                          level:        'info',
                          iconEmoji:    ':wave:',
                          unfurlLinks:  false
                        }


module.exports.SlackTransport = class SlackTransport extends Transport {

  constructor(opts) {

    if(!opts.webhook){
      throw new Error("webhook is required")
    }

    const options = Object.assign({},defaultOptions,opts)

    super(options)
    this.options = options

  }

  async log(info, callback){
    let slackResponse,
        color,
        payload = {
                  text:       `*${info.level}*`,
                  channel:     this.options.channel,
                  username:    this.options.username,
                  icon_emoji:  this.options.iconEmoji,
                  unfurlLinks: this.options.unfurlLinks,
                  attachments: []
                }


    // set the appropriate color (courtesy of https://github.com/motomux/winston-slack-webhook)
    switch (info.level) {
      case 'error':
        color = "danger"
        break
      case 'warn':
        color = "warning"
        break
      default:
        color = "good"
    }

    // get all the info and make it act like an attachment
    Object.keys(info).forEach(key => {
      payload.attachments.push({
              fallback: util.inspect(info[key]),
              text: `${key}: ${util.inspect(info[key])}`,
              color: color,
          })
    })


    const body = JSON.stringify(payload),
          url = this.options.webhook,
          props = {
                    method:'post',
                    body: body,
                    headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                                'Content-Length': Buffer.byteLength(body)
                              }
                  }

    try{
      slackResponse = await fetch(url, props)
    }catch(err){
      console.log(err)
      callback(err)
      return
    }

    if(slackResponse.status === 200){
      callback(null, slackResponse)
    }else{
      callback(slackResponse.statusText)
    }

    setImmediate( () => {
      this.emit('logged', info)
    })
  }
}
