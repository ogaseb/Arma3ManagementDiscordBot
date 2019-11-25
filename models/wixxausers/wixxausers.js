"use strict";
module.exports = (sequelize, DataTypes) => {
  const WixxaUsers = sequelize.define(
    "WixxaUsers",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      name: DataTypes.STRING,
      wixxaPoints: { type: DataTypes.INTEGER, field: "wixxa_points" },
      discordId: { type: DataTypes.STRING, field: "discord_id" },
      createdAt: {
        type: DataTypes.DATE,
        field: "created_at"
      },
      updatedAt: {
        type: DataTypes.DATE,
        field: "updated_at"
      }
    },
    {}
  );
  WixxaUsers.associate = function(models) {
    // associations can be defined here
  };
  return WixxaUsers;
};
