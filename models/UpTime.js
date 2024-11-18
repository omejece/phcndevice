'use strict';
module.exports = (sequelize, DataTypes) => {
  const UpTime = sequelize.define('UpTime', {
    duid: DataTypes.STRING,
    siteid: DataTypes.INTEGER,
    userid: DataTypes.INTEGER,
    duration: DataTypes.DOUBLE,
    datetaken: DataTypes.DATE
  }, {});
  UpTime.associate = function(models) {
    UpTime.belongsTo(models.User);
    UpTime.belongsTo(models.Site);
  };
  return UpTime;
};