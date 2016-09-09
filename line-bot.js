import request from "request-promise";

const CHANNEL_ID = process.env.CHANNEL_ID;
const CHANNEL_SECRET = process.env.CHANNEL_SECRET;
const MID = process.env.MID;

const LINE_API = 'https://trialbot-api.line.me/v1/events';

export function sendTextMessage(sender, text) {

  const data = {
    to: [sender],
    toChannel: 1383378250,
    eventType: "138311608800106203",
    content: {
      contentType: 1,
      toType: 1,
      text,
    }
  };

  console.log('send: ', data);

  request({
    url: LINE_API,
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'X-Line-ChannelID': CHANNEL_ID,
      'X-Line-ChannelSecret': CHANNEL_SECRET,
      'X-Line-Trusted-User-With-ACL': MID
    },
    method: 'POST',
    body: JSON.stringify(data)
  })
  .then(res => {
    if (res.error) console.log('Error: ', response.body.error);
  })
  .catch(error => console.log('Error sending messages: ', error.message))
}

function toMarker({ lat, long, pokemon, id, dist, remain }) {
  return {
    contentType: 7,
    toType: 1,
    text: `${pokemon}`,
    location: {
      title: `${pokemon}的位置，距離 ${dist} 公尺，剩下時間 ${remain}`,
      latitude: lat,
      longitude: long
    }
  };
}

const ids = [10, 13, 16, 19];

export function sendLocationMessage(sender, pokemons) {
  const data = {
    to: [sender],
    toChannel: 1383378250,
    eventType: "140177271400161403",//"138311608800106203",
    content: {
      messageNotified: 0,
      messages:
        pokemons
          .filter(({ id}) => ids.indexOf(id) === -1)
          .slice(0, 5)
          .map(toMarker),
    }
  };

  console.log('send: ', data);

  request({
    url: LINE_API,
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'X-Line-ChannelID': CHANNEL_ID,
      'X-Line-ChannelSecret': CHANNEL_SECRET,
      'X-Line-Trusted-User-With-ACL': MID
    },
    method: 'POST',
    body: JSON.stringify(data)
  })
  .then(res => {
    if (res.error) console.log('Error: ', response.body.error);
  })
  .catch(error => console.log('Error sending messages: ', error.message))

}
