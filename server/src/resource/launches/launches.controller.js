const Launch = require('./launches.model');
const Planet = require('../planets/planets.model');

// 分页
const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_LIMIT = 0;

function getPagination(query) {
  const page = Math.abs(query.page) || DEFAULT_PAGE_NUMBER;
  const limit = Math.abs(query.limit) || DEFAULT_PAGE_LIMIT;
  const skip = (page - 1) * limit;
  return {
    skip,
    limit,
  };
}

// 新加项目自增
const DEFAULT_FLIGHT_NUMBER = 100;
async function getLatestFlightNumber() {
  const latest = await Launch.findOne().sort('-flightNumber').lean().exec();
  if (!latest) {
    return DEFAULT_FLIGHT_NUMBER;
  }

  return latest.flightNumber;
}

// 新增或修改数据
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

async function abortLaunchById(launchId) {
  const aborted = await Launch.updateOne(
    {
      flightNumber: launchId,
    },
    {
      upcoming: false,
      success: false,
    }
  );

  return aborted;
}

async function getAllLaunches(req, res, next) {
  try {
    const { skip, limit } = getPagination(req.query);
    const launches = await Launch.find({}, { _id: 0, __v: 0 })
      .sort({ flightNumber: 1 })
      .skip(skip)
      .limit(limit);
    res.status(200).json(launches);
  } catch (error) {
    next(error);
  }
}

async function addNewLaunch(req, res, next) {
  try {
    const launch = req.body;
    if (
      !launch.mission ||
      !launch.rocket ||
      !launch.launchDate ||
      !launch.target
    ) {
      return res.status(400).json({
        error: 'Missing required launch property',
      });
    }

    launch.launchDate = new Date(launch.launchDate);
    if (isNaN(launch.launchDate)) {
      return res.status(400).json({
        error: 'Invalid launch date',
      });
    }
    const planet = await Planet.findOne({
      keplerName: launch.target,
    });

    if (!planet) {
      throw new Error('No matching planet found');
    }

    const newFlightNumber = (await getLatestFlightNumber()) + 1;
    const newLaunch = Object.assign(launch, {
      success: true,
      upcoming: true,
      customers: ['Zero to Mastery', 'NASA'],
      flightNumber: newFlightNumber,
    });

    await saveLaunch(newLaunch);
    res.status(201).json(newLaunch);
  } catch (error) {
    next(error);
  }
}
async function abortLaunch(req, res, next) {
  try {
    const launchId = Number(req.params.id);

    const existsLaunch = await Launch.findOne({ flightNumber: launchId });
    if (!existsLaunch) {
      return res.status(404).json({
        error: 'Launch not found',
      });
    }

    const aborted = await abortLaunchById(launchId);
    if (!aborted) {
      return res.status(400).json({
        error: 'Launch not aborted',
      });
    }

    return res.status(200).json({
      ok: true,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllLaunches,
  addNewLaunch,
  abortLaunch,
};
