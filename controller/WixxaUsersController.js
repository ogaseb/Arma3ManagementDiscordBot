require("dotenv").config();
const { Sequelize } = require("sequelize");
const models = require("../models/index");
const Op = Sequelize.Op;
const WixxaUsers = models.WixxaUsers;

module.exports.addWixxaUser = obj => {
  WixxaUsers.findOrCreate({
    where: {
      discordId: obj.discordId
    },
    defaults: obj
  });
};
