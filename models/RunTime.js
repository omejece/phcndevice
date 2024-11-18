'use strict';
module.exports = (sequelize, DataTypes) => {
  const RunTime = sequelize.define('RunTime', {
    duid: DataTypes.STRING,
    userid: DataTypes.INTEGER,
    siteid: DataTypes.INTEGER,
    duration: DataTypes.DOUBLE,
    startingduration: DataTypes.DOUBLE,
    datetaken: DataTypes.DATE
  }, {});
  RunTime.associate = function(models) {
    RunTime.belongsTo(models.User);
    RunTime.belongsTo(models.Site);
  };
  return RunTime;
};