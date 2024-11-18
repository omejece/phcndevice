'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class phcndataprofile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      phcndataprofile.belongsTo(models.PhcnDevice, { targetKey: 'duid', foreignKey: 'duid'});
    }
  };
  phcndataprofile.init({
    userid: DataTypes.INTEGER,
    siteid: DataTypes.INTEGER,
    duid: DataTypes.STRING,
    consumptionkw: DataTypes.DOUBLE,
    activepower: DataTypes.DOUBLE,
    consumptionkva: DataTypes.DOUBLE,
    activeenergy: DataTypes.DOUBLE,
    reactiveenergy: DataTypes.DOUBLE,
    device_type: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'phcndataprofile',
  });
  return phcndataprofile;
};