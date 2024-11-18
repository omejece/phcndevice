'use strict';

module.exports = (sequelize, DataTypes) => {
  const GenDevice = sequelize.define('GenDevice', {
    siteid: DataTypes.INTEGER,
    userid: DataTypes.INTEGER,
    gendeviceid: DataTypes.INTEGER,
    sensortype: DataTypes.INTEGER,
    name: DataTypes.STRING,
    duid: DataTypes.STRING,
    gauge: DataTypes.DOUBLE,
    gauge2: DataTypes.DOUBLE,
    clearance: DataTypes.DOUBLE,
    flowrate: DataTypes.DOUBLE,
    control: DataTypes.INTEGER,
    frequency: DataTypes.DOUBLE,
    voltage: DataTypes.DOUBLE,
    voltagea: DataTypes.DOUBLE,
    voltageb: DataTypes.DOUBLE,
    voltagec: DataTypes.DOUBLE,
    currenta: DataTypes.DOUBLE,
    currentb: DataTypes.DOUBLE,
    currentc: DataTypes.DOUBLE,
    powerfactora: DataTypes.DOUBLE,
    powerfactorb: DataTypes.DOUBLE,
    powerfactorc: DataTypes.DOUBLE,
    activepower: DataTypes.DOUBLE,
    reactivepower: DataTypes.DOUBLE,
    avar: DataTypes.DOUBLE,
    cvar: DataTypes.DOUBLE,
    tankheight: DataTypes.DOUBLE,
    longitude: DataTypes.DOUBLE,
    latitude: DataTypes.DOUBLE,
    status: DataTypes.INTEGER,
    lastupdated: DataTypes.DATE,
    gpstimestamp: DataTypes.DATE
  }, {});
  GenDevice.associate = function(models) {
    // associations can be defined here
  };
  return GenDevice;
};