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
  getMonthSeries,
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

async function getMonthSeries(monthPosition, streamingServiceName = "all") {
  let currentMonth = new Date(getTodayDate()).getMonth() + 1;
  let currentYear = new Date(getTodayDate()).getFullYear();

  let series = [];
  if (streamingServiceName === "all") series = await getAll();
  else series = await getByStreamingService(streamingServiceName);

  let seriesFilter = series?.filter((x) => {
    let serieMonth = new Date(x.dataValues.date).getMonth() + 1;
    let serieYear = new Date(x.dataValues.date).getFullYear();

    if (monthPosition === "current") {
      return serieMonth === currentMonth;
    }

    if (monthPosition === "next") {
      return (
        serieMonth === currentMonth + 1 ||
        (serieYear === currentYear + 1 &&
          serieMonth === 1 &&
          currentMonth === 12)
      );
    }

    if (monthPosition === "before") {
      return (
        serieMonth === currentMonth - 1 ||
        (serieYear === currentYear - 1 &&
          serieMonth === 12 &&
          currentMonth === 1)
      );
    }
  });

  return seriesFilter;
}

function getTodayDate() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();

  today = mm + "/" + dd + "/" + yyyy;
  return today;
}
