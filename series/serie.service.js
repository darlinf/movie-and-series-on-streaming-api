const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config.json");

const db = require("_helpers/db");

module.exports = {
  getAll,
  getById,
  create,
  update,
  getByStreamingService,
  delete: _delete,
};

async function getAll() {
  return await db.Serie.findAll();
}

async function getById(id) {
  return await getSerie(id);
}

async function getByStreamingService(streamingService) {
  const series = await db.Serie.findAll({
    where: { streamingService: streamingService },
  });

  return series;
}

async function create(params) {
  const serie = new db.Serie(params);
  await serie.save();
}

async function update(id, params) {
  const serie = await getSerie(id);

  // copy params to user and save
  Object.assign(serie, params);
  await serie.save();
}

async function _delete(id) {
  const serie = await getSerie(id);
  await serie.destroy();
}

async function getSerie(id) {
  const serie = await db.Serie.findByPk(id);
  if (!serie) throw "Serie not found";
  return serie;
}
