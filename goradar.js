import request from "request-promise";
import { stringify } from "querystring";
import pokemon from "pokemon";
import geolib from "geolib";
import moment from "moment";


const GoRadarURL = "https://www.pokeradar.io/api/v1/submissions"

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
      const pokemons =
        data
          .map(({ created, pokemonId, latitude, longitude, trainerName }) => {
            let name = pokemon.getName(pokemonId, "zh-Hant");
            if (!trainerName.match(/Poke\ Radar\ Prediction/)) {
              name += "(玩家回報)"
            }
            return {
              id: pokemonId,
              lat: latitude,
              long: longitude,
              pokemon: name,
              dist: geolib.getDistance(location, { latitude, longitude }),
              remain:  moment.utc(0).seconds(15 * 60 + created - moment().unix()).format('mm:ss'),
            };
          })
          .sort((a, b) => a.dist - b.dist)

      cb(pokemons);
    });
}
