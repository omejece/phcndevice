'use strict';
module.exports = (sequelize, DataTypes) => {
  const PhcnDevice = sequelize.define('PhcnDevice', {
    siteid: DataTypes.INTEGER,
    userid: DataTypes.INTEGER,
    source_type: DataTypes.INTEGER,
    source_uid: DataTypes.STRING,
    name: DataTypes.STRING,
    duid: DataTypes.STRING,
    cost_per_kwh: DataTypes.DOUBLE,
    vat: DataTypes.DECIMAL,
    powerstatus: DataTypes.DOUBLE,
    consumptionkw: DataTypes.DOUBLE,
    activepower: DataTypes.DOUBLE,
    consumptionkva: DataTypes.DOUBLE,
    sumactiveenergy: DataTypes.DOUBLE,
    totalactiveenergy: DataTypes.DOUBLE,
    voltagea: DataTypes.DOUBLE,
    voltageb: DataTypes.DOUBLE,
    voltagec: DataTypes.DOUBLE,
    currenta: DataTypes.DOUBLE,
    currentb: DataTypes.DOUBLE,
    currentc: DataTypes.DOUBLE,
    powerfactora: DataTypes.DOUBLE,
    powerfactorb: DataTypes.DOUBLE,
    powerfactorc: DataTypes.DOUBLE,
    frequency: DataTypes.DOUBLE,
    previousuptime: DataTypes.DOUBLE,
    lastuptime: DataTypes.DATE,
    control: DataTypes.INTEGER,
    status: DataTypes.INTEGER
  }, {});
  PhcnDevice.associate = function(models) {
    // associations can be defined here
  };
  return PhcnDevice;
};