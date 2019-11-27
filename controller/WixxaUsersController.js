require("dotenv").config();
const { Sequelize } = require("sequelize");
const models = require("../models/index");
const { Op } = Sequelize;
const { WixxaUsers } = models;

module.exports.addWixxaUser = obj => {
  WixxaUsers.findOrCreate({
    where: {
      discordId: obj.discordId
    },
    defaults: obj
  });
};

module.exports.getWixxaUser = async discordId => {
  return WixxaUsers.findOne({
    where: {
      discordId
    }
  });
};

module.exports.updateWixxaPoints = async obj => {
  return WixxaUsers.update(
    {
      wixxaPoints: obj.wixxaPoints
    },
    {
      where: {
        discordId: obj.discordId
      },
      returning: true
    }
  );
};

module.exports.getAllWixxaUsers = async () => {
  return WixxaUsers.findAll();
};
