const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config.json");
var nodemailer = require("nodemailer");

const db = require("_helpers/db");

module.exports = {
  authenticate,
  getAll,
  getById,
  create,
  update,
  delete: _delete,
};

async function authenticate({ email, password }) {
  const user = await db.User.findOne({
    where: { email: email },
  });

  if (!user) throw "Username or password is incorrect";

  if (!(await bcrypt.compare(password, user.passwordHash)))
    throw "Username or password is incorrect";

  // create a jwt token that is valid for 7 days
  const token = jwt.sign({ sub: user.id, role: user.role }, config.secret, {
    expiresIn: "7d",
  });
  return {
    ...omitPassword(user?.dataValues),
    token,
  };
}

async function getAll() {
  return await db.User.findAll();
}

async function getById(id) {
  return await getUser(id);
}

async function create(params) {
  // validate
  if (await db.User.findOne({ where: { email: params.email } })) {
    throw 'Email "' + params.email + '" is already registered';
  }

  const user = new db.User(params);

  // hash password
  user.passwordHash = await bcrypt.hash(params.password, 10);

  user.verifiedEmail = false;

  sendConfirmedMail();

  // save user
  await user.save();
}

async function update(id, params) {
  const user = await getUser(id);

  // validate
  const emailChanged = params.email && user.email !== params.email;
  if (
    emailChanged &&
    (await db.User.findOne({ where: { email: params.email } }))
  ) {
    throw 'Email "' + params.email + '" is already registered';
  }

  // hash password if it was entered
  if (params.password) {
    params.passwordHash = await bcrypt.hash(params.password, 10);
  }

  // copy params to user and save
  Object.assign(user, params);
  await user.save();
}

async function _delete(id) {
  const user = await getUser(id);
  await user.destroy();
}

async function getUser(id) {
  const user = await db.User.findByPk(id);
  if (!user) throw "User not found";
  return user;
}

// helper functions

function omitPassword(user) {
  const { passwordHash, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

function sendConfirmedMail() {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: config.mailOptions.from,
      pass: config.mailOptions.pass,
    },
  });

  var mailOptions = {
    from: config.mailOptions.from,
    to: config.mailOptions.to,
    subject: "Sending Email using Node.js",
    text: "That was easy!",
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}
