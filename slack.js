import { query } from "./goradar";
import request from "request-promise";

function notify(text) {
  const payload = {
    channel: "#pokemon",
    username: "PokemonBot",
    text,
  };

  request({
    method: 'POST',
    uri: process.env.SLACK_URL,
    form: { payload: `${JSON.stringify(payload)}` },
  }).then(console.log);
}

const latitude = process.env.LAT || 25.032101;
const longitude = process.env.LNT || 121.5556329;
const distance = process.env.DIST || 1200;

function toText({ lat, long, pokemon, id, remain, dist }) {
  const imageURL = `https://maps.googleapis.com/maps/api/staticmap?size=640x400&sensor=false&center=${latitude},${longitude}&markers=${lat},${long}&maptype=roadmap.jpg`;
  return `${pokemon}的位置，距離 ${dist} 公尺，剩下時間 ${remain}\n<${imageURL}>`;
}

const ids = [
    6,  38,  59,  65,  67,  68,
   78,  82,  87,  89,  91,  94,
   97, 101, 105, 110, 113, 131,
  134, 135, 136, 137, 139, 142,
  141, 143, 149
];

const execute = () =>
  query({ latitude, longitude }, distance, pokemons => {
    const filtered = pokemons.filter(({ id }) => ids.indexOf(id) > -1)
    if (filtered.length > 0) {
      filtered.map(toText).map(notify);
    }
    setTimeout(() => execute(), 5 * 60 * 1000);
  })

execute();
