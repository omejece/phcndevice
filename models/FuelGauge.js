'use strict';
module.exports = (sequelize, DataTypes) => {
  const FuelGauge = sequelize.define('FuelGauge', {
    duid: DataTypes.STRING,
    userid: DataTypes.INTEGER,
    siteid: DataTypes.INTEGER,
    gauge: DataTypes.DOUBLE,
    datetaken: DataTypes.DATEONLY,
    timetaken: DataTypes.TIME
  }, {});
  FuelGauge.associate = function(models) {
    FuelGauge.belongsTo(models.User);
    FuelGauge.belongsTo(models.Site);
  };
  return FuelGauge;
};