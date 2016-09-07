import request from "request-promise";
import { stringify } from "querystring";
import pokemon from "pokemon";
import geolib from "geolib";
import moment from "moment";


const GoRadarURL = "https://www.pokeradar.io/api/v1/submissions"

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

export function query(location, distance, cb) {
  const [min, max] = geolib.getBoundsOfDistance(location, distance);
  const params = {
    minLatitude: min.latitude,
    minLongitude: min.longitude,
    maxLatitude: max.latitude,
    maxLongitude: max.longitude,
    pokemonId: 0,
  }
  console.log(`-- curl ${GoRadarURL}?${stringify(params)} --`);

  request(`${GoRadarURL}?${stringify(params)}`)
    .then(res => {
      const { data }= JSON.parse(res);
      const message =
        data
          .map(({ created, pokemonId, latitude, longitude }) => ({
            pokemon: pokemon.getName(pokemonId, "zh-Hant"),
            dist: geolib.getDistance(location, { latitude, longitude }),
            remain:  moment.utc(0).seconds(15 * 60 + created - moment().unix()).format('mm:ss'),
          }))
          .sort((a, b) => a.dist - b.dist)
          .map(({ pokemon, dist, remain }) => `${pokemon} 距離 ${dist} 公尺，剩下 ${remain} 分鐘`)
          .join("\n");
      cb(message);
    });
}
