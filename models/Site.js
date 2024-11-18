'use strict';
module.exports = (sequelize, DataTypes) => {
  const Site = sequelize.define('Site', {
    userid: DataTypes.INTEGER,
    name: DataTypes.STRING,
    description: DataTypes.STRING
  }, {});
  Site.associate = function(models) {
    Site.belongsTo(models.User);
    Site.hasMany(models.PhcnDevice);
    Site.hasMany(models.InverterDevice);
    Site.hasMany(models.GenDevice);
    Site.hasMany(models.DownTime);
    Site.hasMany(models.UpTime);
    Site.hasMany(models.RunTime);
    Site.hasMany(models.FConsumption);
    Site.hasMany(models.inverterbatteryundervoltagereport);
  };
  return Site;
};