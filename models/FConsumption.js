'use strict';
module.exports = (sequelize, DataTypes) => {
  const FConsumption = sequelize.define('FConsumption', {
    duid: DataTypes.STRING,
    userid: DataTypes.INTEGER,
    siteid: DataTypes.INTEGER,
    consumption: DataTypes.DOUBLE,
    datetaken: DataTypes.DATE
  }, {});
  FConsumption.associate = function(models) {
    FConsumption.belongsTo(models.User);
    FConsumption.belongsTo(models.Site);
  };
  return FConsumption;
};