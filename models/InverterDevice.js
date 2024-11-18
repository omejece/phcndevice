'use strict';
module.exports = (sequelize, DataTypes) => {
  const InverterDevice = sequelize.define('InverterDevice', {
    duid: DataTypes.STRING,
    name: DataTypes.STRING,
    siteid: DataTypes.INTEGER,
    userid: DataTypes.INTEGER,
    voltage: DataTypes.DOUBLE,
    charging_current: DataTypes.DECIMAL,
    vbat1: DataTypes.DECIMAL,
    vbat2: DataTypes.DECIMAL,
    vbat3: DataTypes.DECIMAL,
    vbat4: DataTypes.DECIMAL,
    vbat5: DataTypes.DECIMAL,
    vbat6: DataTypes.DECIMAL,
    vbat7: DataTypes.DECIMAL,
    vbat8: DataTypes.DECIMAL,
    vbat9: DataTypes.DECIMAL,
    vbat10: DataTypes.DECIMAL,
    vbat11: DataTypes.DECIMAL,
    vbat12: DataTypes.DECIMAL,
    vbat13: DataTypes.DECIMAL,
    vbat14: DataTypes.DECIMAL,
    vbat15: DataTypes.DECIMAL,
    vbat16: DataTypes.DECIMAL,
    tbat1: DataTypes.DECIMAL,
    tbat2: DataTypes.DECIMAL,
    tbat3: DataTypes.DECIMAL,
    tbat4: DataTypes.DECIMAL,
    tbat5: DataTypes.DECIMAL,
    tbat6: DataTypes.DECIMAL,
    tbat7: DataTypes.DECIMAL,
    tbat8: DataTypes.DECIMAL,
    tbat9: DataTypes.DECIMAL,
    tbat10: DataTypes.DECIMAL,
    tbat11: DataTypes.DECIMAL,
    tbat12: DataTypes.DECIMAL,
    tbat13: DataTypes.DECIMAL,
    tbat14: DataTypes.DECIMAL,
    tbat15: DataTypes.DECIMAL,
    tbat16: DataTypes.DECIMAL,
    control: DataTypes.INTEGER,
    status: DataTypes.INTEGER
  }, {});
  InverterDevice.associate = function(models) {
    // associations can be defined here
  };
  return InverterDevice;
};