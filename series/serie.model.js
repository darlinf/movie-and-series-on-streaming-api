const { DataTypes } = require("sequelize");

module.exports = model;

function model(sequelize) {
  const attributes = {
    date: { type: DataTypes.DATE, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    imageURL: { type: DataTypes.STRING, allowNull: false },
    trailer: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false },
    streamingService: { type: DataTypes.STRING, allowNull: false },
    remember: { type: DataTypes.STRING, allowNull: false },
  };

  const options = {
    defaultScope: {},
    scopes: {
      // include hash with this scope
      withHash: { attributes: {} },
    },
  };

  return sequelize.define("Serie", attributes, options);
}
