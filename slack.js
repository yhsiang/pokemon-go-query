import { query } from "./goradar";

function notify(text) {
  const payload = {
    channel: "#pokemon",
    username: "PokemonBot",
    text: "```" + text + "```",
  };

  request({
    method: 'POST',
    uri: process.env.SLACK_URL,
    form: { payload: `${JSON.stringify(payload)}` },
  }).then(console.log);
}

const latitude = process.env.LAT || 25.032101;
const longitude = process.env.LNT || 121.5556329;
const distance = process.env.DIST || 1000;

query({ latitude, longitude }, distance, meesage => notify(message));
