import request from "request-promise";
import { stringify } from "querystring";
import pokemon from "pokemon";
import geolib from "geolib";
import moment from "moment";


const GoRadarURL = "https://www.pokeradar.io/api/v1/submissions"
const params = {
  deviceId: '840a97e074dd11e6a9d21d9cecf6b316',
  minLatitude: 25.032076552371294,
  maxLatitude: 25.03842425842083,
  minLongitude: 121.55444025993347,
  maxLongitude:121.56448245048523,
  pokemonId: 0,
};

const myLocation = {
  latitude: 25.034359,
  longitude: 121.560087,
};

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

request(`${GoRadarURL}?${stringify(params)}`)
  .then(res => {
    const { data }= JSON.parse(res);
    const message =
      data
        .map(({ created, pokemonId, latitude, longitude }) => ({
          pokemon: pokemon.getName(pokemonId, "zh-Hant"),
          dist: geolib.getDistance(myLocation, { latitude, longitude }),
          remain: 15 - moment().diff(created * 1000, 'minutes'),
        }))
        .sort((a, b) => a.dist - b.dist)
        .map(({ pokemon, dist, remain }) => `${pokemon} 距離 ${dist} 公尺，剩下 ${remain} 分鐘`)
        .join("\n");
    notify(message);
  });
