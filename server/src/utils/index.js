const parse = require('csv-parse');
const axios = require('axios');
const Planet = require('../resource/planets/planets.model');
const Launch = require('../resource/launches/launches.model');
const path = require('path');
const fs = require('fs');

/* -------------------------------------------------------------------------- */
/*                                错误处理中间件                                */
/* -------------------------------------------------------------------------- */
function errorHandler(err, req, res, next) {
  res.status(500).json({
    message: err.message,
  });
}

/* -------------------------------------------------------------------------- */
/*                                   通过csv文件获取宜居星球                     */
/* -------------------------------------------------------------------------- */
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

/* -------------------------------------------------------------------------- */
/*                             通过spaceX api 获取发射数据                       */
/* -------------------------------------------------------------------------- */
const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';

async function populateLaunches() {
  console.log('Downloading launch data...');
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: 'rocket',
          select: {
            name: 1,
          },
        },
        {
          path: 'payloads',
          select: {
            customers: 1,
          },
        },
      ],
    },
  });

  if (response.status !== 200) {
    console.log('Problem downloading launch data');
    throw new Error('Launch data download failed');
  }

  const launchDocs = response.data.docs;
  for (const launchDoc of launchDocs) {
    const payloads = launchDoc['payloads'];
    const customers = payloads.flatMap((payload) => {
      return payload['customers'];
    });
    const launch = {
      flightNumber: launchDoc['flight_number'],
      mission: launchDoc['name'],
      rocket: launchDoc['rocket']['name'],
      launchDate: launchDoc['date_local'],
      upcoming: launchDoc['upcoming'],
      success: launchDoc['success'],
      customers,
    };

    console.log(`${launch.flightNumber} ${launch.mission}`);

    await saveLaunch(launch);
  }
}

async function saveLaunch(launch) {
  await Launch.findOneAndUpdate(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    {
      upsert: true,
    }
  );
}

async function loadLaunchesData() {
  const firstLaunch = await Launch.findOne({
    flightNumber: 1,
    rocket: 'Falcon 1',
    mission: 'FalconSat',
  });
  if (firstLaunch) {
    console.log('Launch data already loaded!');
  } else {
    await populateLaunches();
  }
}

module.exports = {
  errorHandler,
  loadLaunchesData,
  loadPlanetsData,
};
