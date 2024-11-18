'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    apikey: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {});
  User.associate = function(models) {
    User.hasMany(models.Site);
    User.hasMany(models.PhcnDevice);
    User.hasMany(models.InverterDevice);
    User.hasMany(models.GenDevice);
    User.hasMany(models.SubUser);
    User.hasMany(models.DownTime);
    User.hasMany(models.UpTime);
    User.hasMany(models.RunTime);
    User.hasMany(models.FConsumption);
    User.hasOne(models.Subscription);
  };
  return User;
};