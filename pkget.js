import request from "request-promise";
import geolib from "geolib";
import { stringify } from "querystring";
import pokemon from "pokemon";
import moment from "moment";

const PkgetURL = "https://pkget.com/pkm222.aspx"

export function query(location, distance) {
  const [min, max] = geolib.getBoundsOfDistance(location, distance);
  const params = {
    v1: 111,
    v2: max.latitude,
    v3: max.longitude,
    v4: min.latitude,
    v5: min.longitude,
  };

  console.log(`-- curl "${PkgetURL}?${stringify(params)}" -H "X-Requested-With: XMLHttpRequest" -H "Referer: https://pkget.com/" --`);

  return request({
    url: `${PkgetURL}?${stringify(params)}`,
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'Referer': 'https://pkget.com/'
    }
  })
  .then(res => {
      const { pk123 } = JSON.parse(res);
      const pokemons =
        pk123
          .map(({ d1, d3, d4, d5  }) => {
            let name = pokemon.getName(+d1, "zh-Hant");
            const latitude = +d4;
            const longitude = +d5;
            const created = +d3 / 1000;
            return {
              uuid: `${created}-${d1}-${latitude}-${longitude}`,
              id: d1,
              lat: latitude,
              long: longitude,
              pokemon: name,
              type: 'pkget',
              dist: geolib.getDistance(location, { latitude, longitude }),
              remain:  moment.utc(0).seconds(15 * 60 + created - moment().unix()).format('mm:ss'),
            };
          })
          .sort((a, b) => a.dist - b.dist);

      return pokemons;
    })
}
