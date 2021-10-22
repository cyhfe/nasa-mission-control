const Planet = require('./planets.model');

async function getAllPlanets(req, res, next) {
  try {
    const planets = await Planet.find({}, { _id: 0, __v: 0 });
    res.status(200).json(planets);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllPlanets,
};
