# Pokemon Go Query

Pokemon Go Query offer you to be a slack notification or a facebook chatbot.
Inspired by [Go Radar](https://map.goradar.io/) and [Go Notify](https://itunes.apple.com/tw/app/go-notify-get-real-time-notification/id1145779376?mt=8).

# Usage

Require [nodejs](https://nodejs.org/en/).

First, `npm install`.

## Slack Notify

open google map find your location, ex:`https://www.google.com.tw/maps/@25.032101,121.5556329,16z?hl=zh-TW`.

```
$ export LAT=25.032101
$ export LNT=121.5556329
$ export DIST=1000
$ export SLACK_URL=YOUR SLACK INCOMING HOOK URL
$ npm run slack
```

## Facebook bot

Require [ngrok](https://ngrok.com/).

1. create facebook app for page
2. add messenger to products
3. add webhooks to products
4. get your face page access token

```
$ export TOKEN=<FACEBOOK_PAGE_TOKEN>
$ export PORT=3000
$ npm start
$ lt --port 3000
```

More information:
* [Facebook Messenger bot 15 minute tutorial](https://github.com/jw84/messenger-bot-tutorial)
* [[教學] Facebook Messenger API](http://huli.logdown.com/posts/709641-teaching-facebook-messenger-api)
* [用 Python 開發 Facebook Bot](http://www.inside.com.tw/2016/05/17/build-a-facebook-bot-with-python)
* [[教學] Line BOT API](http://huli.logdown.com/posts/726082-line-bot-api-tutorial)

# LICENSE

MIT, Ly Cheng <lyforever62@hotmail.com>
