import request from "request-promise";

const TOKEN = process.env.TOKEN;

export function sendTextMessage(sender, text) {
    let messageData = { text:text }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: TOKEN},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    })
    .then(res => {
      if (res.error) console.log('Error: ', response.body.error);
    })
    .catch(error => console.log('Error sending messages: ', error))
}

function toMarker({ lat, long, pokemon, id, remain }) {
  const imageURL = `https://maps.googleapis.com/maps/api/staticmap?size=764x400&center=${lat},${long}&zoom=18&markers=${lat},${long}`;
  const itemURL = `http://maps.apple.com/maps?q=${lat},${long}&z=16`;

  return {
    "title": `${pokemon}的位置，剩下時間 ${remain}`,
    "image_url": imageURL,
    "item_url": itemURL,
  };
}

export function sendMapMessage(id, pokemons) {
  const elements = pokemons.map(toMarker);
  const messageData = {
    "attachment": {
      "type": "template",
      "payload": {
         "template_type": "generic",
         elements,
      }
    }
  };
  request({
      url: 'https://graph.facebook.com/v2.6/me/messages',
      qs: {access_token: TOKEN},
      method: 'POST',
      json: {
        recipient: { id },
        message: messageData,
      }
  })
  .then(res => {
    if (res.error) console.log('Error: ', response.body.error);
  })
  .catch(error => console.log('Error sending messages: ', error))
}