'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class phcnontime extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  phcnontime.init({
    duid: DataTypes.STRING,
    starttime: DataTypes.DATE,
    datetaken: DataTypes.DATEONLY,
    runtime: DataTypes.DOUBLE,
    status: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'phcnontime',
  });
  return phcnontime;
};