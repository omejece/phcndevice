
'use strict';
module.exports = (sequelize, DataTypes) => {
  const inverterbatteryundervoltagereport = sequelize.define('inverterbatteryundervoltagereport', {
    siteid: DataTypes.INTEGER,
    userid: DataTypes.INTEGER,
    duid: DataTypes.STRING,
    voltage1: DataTypes.DECIMAL,
    voltage2: DataTypes.DECIMAL,
    voltage3: DataTypes.DECIMAL,
    voltage4: DataTypes.DECIMAL,
    voltage5: DataTypes.DECIMAL,
    voltage6: DataTypes.DECIMAL,
    voltage7: DataTypes.DECIMAL,
    voltage8: DataTypes.DECIMAL,
    datetaken: DataTypes.DATE,
    timetaken: DataTypes.TIME,
  }, {});
  inverterbatteryundervoltagereport.associate = function(models) {
    inverterbatteryundervoltagereport.belongsTo(models.Site);
  };
  return inverterbatteryundervoltagereport;
};

