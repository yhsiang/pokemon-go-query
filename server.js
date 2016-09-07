import express from "express";
import bodyParser from "body-parser";
import request from "request-promise";
import { query } from "./notify";

const PORT = process.env.PORT || 3000;
const TOKEN = process.env.TOKEN;
const app = express();

function sendTextMessage(sender, text) {
    let messageData = { text:text }
    console.log("Log")
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: TOKEN},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.get('/', function (req, res) {
    res.send('Hello world, I am a chat bot')
})

app.get('/webhook', function (req, res) {
    if (req.query['hub.verify_token'] === TOKEN) {
      res.send(req.query['hub.challenge'])
    } else {
      res.send('Error, wrong token')
    }
})

app.post('/webhook', function (req, res) {
    let messaging_events = req.body.entry[0].messaging
    console.log(JSON.stringify(req.body));
    for (let i = 0; i < messaging_events.length; i++) {
        let event = req.body.entry[0].messaging[i]
        let sender = event.sender.id
        if (event.message && event.message.attachments && event.message.attachments[0].payload.coordinates) {
          let {lat, long} = event.message.attachments[0].payload.coordinates;
          query({latitude: lat, longitude: long}, 1000, (message) => {
            sendTextMessage(sender, message.substring(0, 320));
          })
        }
    }
    res.sendStatus(200)
})

app.listen(PORT, () => console.log(`Server listen on ${PORT}`));
