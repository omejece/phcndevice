'use strict';
module.exports = (sequelize, DataTypes) => {
  const PowerTime = sequelize.define('PowerTime', {
    userid: DataTypes.INTEGER,
    siteid: DataTypes.INTEGER,
    duid: DataTypes.STRING,
    timetaken: DataTypes.TIME,
    datetaken: DataTypes.DATE,
    workingtimetaken: DataTypes.TIME,
    workingdatetaken: DataTypes.DATE,
    startingduration: DataTypes.DOUBLE(10,2),
    status: DataTypes.INTEGER,
    isactive: DataTypes.INTEGER
  }, {});
  PowerTime.associate = function(models) {
    // associations can be defined here
  };
  return PowerTime;
};