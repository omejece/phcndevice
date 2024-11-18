'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PowerConsumption extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  PowerConsumption.init({
    userid: DataTypes.INTEGER,
    siteid: DataTypes.INTEGER,
    uid: DataTypes.STRING,
    consumptionkw: DataTypes.DOUBLE,
    consumptionkva: DataTypes.DOUBLE,
    datetaken: DataTypes.DATEONLY
  }, {
    sequelize,
    modelName: 'PowerConsumption',
  });
  return PowerConsumption;
};