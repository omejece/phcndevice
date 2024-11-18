'use strict';
module.exports = (sequelize, DataTypes) => {
  const DownTime = sequelize.define('DownTime', {
    duid: DataTypes.STRING,
    userid: DataTypes.INTEGER,
    siteid: DataTypes.INTEGER,
    duration: DataTypes.DOUBLE,
    datetaken: DataTypes.DATE
  }, {});
  DownTime.associate = function(models) {
    DownTime.belongsTo(models.User);
    DownTime.belongsTo(models.Site);
  };
  return DownTime;
};