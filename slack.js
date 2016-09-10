import * as pokeradar from "./pokeradar";
import * as pkget from "./pkget";
import request from "request-promise";
import Promise from "bluebird";

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
const distance = process.env.DIST || 729;

function toText({ lat, long, pokemon, id, remain, dist, end }) {
  const imageURL = `https://maps.googleapis.com/maps/api/staticmap?size=640x400&sensor=false&center=${latitude},${longitude}&markers=${lat},${long}&maptype=roadmap.jpg`;
  return `${pokemon}的位置，距離 ${dist} 公尺，剩下時間 ${remain} (${end})\n<${imageURL}>`;
}

const ids = [
    6,  25,  38,  59,  65,  67, 68,
   78,  82,  87,  89,  91,  94,
   97, 101, 105, 110, 113, 131,
  134, 135, 136, 137, 139, 142,
  141, 143, 149
];

const execute = () => {
  Promise.all([
    pokeradar.query({ latitude, longitude }, distance),
    pkget.query({ latitude, longitude }, distance)
  ]).then(results => {
    const pokemons = results.reduce((acc, cur) => {
      acc = acc.concat(cur);
      return acc;
    },[])

    const filtered =
      pokemons
        .filter(it => !it.remain.match(/^00/))
        .filter(({ id }) => ids.indexOf(id) > -1);

    if (filtered.length > 0) {
      filtered.map(toText).map(it => {
        notify(it);
      });
    }
    setTimeout(() => execute(), 15 * 60 * 1000);
  })
}

execute();
