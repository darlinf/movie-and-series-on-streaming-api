const express = require("express");
const router = express.Router();
const Joi = require("joi");

const validateRequest = require("_middleware/validate-request");
const Role = require("_helpers/role");
const serieService = require("./serie.service");
const authorize = require("_helpers/authorize");

// routes

router.get("/getAllSeries", getAll);
router.get("/getByIdSeries/:id", getById);
router.post("/createSeries", authorize(Role.Admin), createSchema, create);
router.put("/updateSeries/:id", authorize(Role.Admin), updateSchema, update);
router.delete("/deleteSeries/:id", authorize(Role.Admin), _delete);

module.exports = router;

// route functions

function getAll(req, res, next) {
  serieService
    .getAll()
    .then((users) => res.json(users))
    .catch(next);
}

function getById(req, res, next) {
  serieService
    .getById(req.params.id)
    .then((user) => res.json(user))
    .catch(next);
}

function create(req, res, next) {
  serieService
    .create(req.body)
    .then(() => res.json({ message: "Serie created" }))
    .catch(next);
}

function update(req, res, next) {
  serieService
    .update(req.params.id, req.body)
    .then(() => res.json({ message: "Serie updated" }))
    .catch(next);
}

function _delete(req, res, next) {
  serieService
    .delete(req.params.id)
    .then(() => res.json({ message: "Serie deleted" }))
    .catch(next);
}

// schema functions

function createSchema(req, res, next) {
  const schema = Joi.object({
    date: Joi.string().required(),
    name: Joi.string().required(),
    imageURL: Joi.string().required(),
    trailer: Joi.string().required(),
    description: Joi.string().required(),
    streamingService: Joi.string().required(),
    remember: Joi.string().required(),
  });
  validateRequest(req, next, schema);
}

function updateSchema(req, res, next) {
  const schema = Joi.object({
    date: Joi.string().empty(""),
    name: Joi.string().empty(""),
    imageURL: Joi.string().empty(""),
    trailer: Joi.string().empty(""),
    description: Joi.string().empty(""),
    streamingService: Joi.string().empty(""),
    remember: Joi.string().empty(""),
  });
  validateRequest(req, next, schema);
}
