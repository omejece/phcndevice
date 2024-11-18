'use strict';
module.exports = (sequelize, DataTypes) => {
  const TankDevice = sequelize.define('TankDevice', {
    siteid: DataTypes.INTEGER,
    gendeviceid: DataTypes.INTEGER,
    userid: DataTypes.INTEGER,
    name: DataTypes.STRING,
    duid: DataTypes.STRING,
    gauge: DataTypes.DOUBLE,
    flowrate: DataTypes.DOUBLE,
    control: DataTypes.INTEGER,
    voltage: DataTypes.DECIMAL,
    status: DataTypes.INTEGER
  }, {});
  TankDevice.associate = function(models) {
    // associations can be defined here
  };
  return TankDevice;
};