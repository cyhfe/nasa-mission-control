const parse = require('csv-parse');
const Planet = require('../resource/planets/planets.model');
const path = require('path');
const fs = require('fs');

function errorHandler(err, req, res, next) {
  res.status(500).json({
    message: err.message,
  });
}

// 宜居星球条件
function isHabitablePlanet(planet) {
  return (
    planet['koi_disposition'] === 'CONFIRMED' &&
    planet['koi_insol'] > 0.36 &&
    planet['koi_insol'] < 1.11 &&
    planet['koi_prad'] < 1.6
  );
}

// 从csv文件读取数据, 保存到mongodb数据库中
function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(path.join(__dirname, '..', 'data', 'plants.csv'))
      .pipe(
        parse({
          comment: '#',
          columns: true,
        })
      )
      .on('data', async (data) => {
        if (isHabitablePlanet(data)) {
          savePlanet(data);
        }
      })
      .on('error', (err) => {
        console.log(err);
        reject(err);
      })
      .on('end', async () => {
        const countPlanetsFound = (await Planet.find({})).length;
        console.log(`${countPlanetsFound} habitable planets found!`);
        resolve();
      });
  });
}

async function savePlanet(planet) {
  try {
    await Planet.updateOne(
      {
        keplerName: planet.kepler_name,
      },
      {
        keplerName: planet.kepler_name,
      },
      {
        upsert: true,
      }
    );
  } catch (err) {
    console.error(`Could not save planet ${err}`);
  }
}

function loadLaunchesData() {}

module.exports = {
  errorHandler,
  loadLaunchesData,
  loadPlanetsData,
};
