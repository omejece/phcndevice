'use strict';
module.exports = (sequelize, DataTypes) => {
  const Device = sequelize.define('Device', {
    uid: DataTypes.STRING,
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    siteId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    voltage: DataTypes.DOUBLE(10,2),
    control: DataTypes.INTEGER,
    status: DataTypes.INTEGER
  }, {});
  Device.associate = function(models) {
    Device.belongsTo(models.User);
    Device.belongsTo(models.Site);
  };
  return Device;
};