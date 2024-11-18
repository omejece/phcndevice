'use strict';
module.exports = (sequelize, DataTypes) => {
  const DeviceList = sequelize.define('DeviceList', {
    duid: DataTypes.STRING,
    status: DataTypes.INTEGER
  }, {});
  DeviceList.associate = function(models) {
    // associations can be defined here
  };
  return DeviceList;
};