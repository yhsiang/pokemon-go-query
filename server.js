import express from "express";
import bodyParser from "body-parser";
import { sendMapMessage } from "./messenger";
import { query } from "./goradar";

const PORT = process.env.PORT || 3000;
const TOKEN = process.env.TOKEN;
const app = express();


app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.get('/', function (req, res) {
  console.log('GET /')
  res.send('Hello world, I am a chat bot')
})

app.get('/webhook', function (req, res) {
  console.log('Verifying');
  if (req.query['hub.verify_token'] === TOKEN) {
    res.send(req.query['hub.challenge'])
  } else {
    res.send('Error, wrong token')
  }
})

app.post('/webhook', function (req, res) {
  console.log('POST /webhook')
  let messaging_events = req.body.entry[0].messaging
  console.log(JSON.stringify(req.body));
  for (let i = 0; i < messaging_events.length; i++) {
      let event = req.body.entry[0].messaging[i]
      let sender = event.sender.id
      if (event.message && event.message.attachments && event.message.attachments[0].payload.coordinates) {
        let {lat, long} = event.message.attachments[0].payload.coordinates;
        query({latitude: lat, longitude: long}, 1000, pokemons => {
          sendMapMessage(sender, pokemons);
        })
      }
  }
  res.sendStatus(200)
})

app.listen(PORT, () => console.log(`Server listen on ${PORT}`));
