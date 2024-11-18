'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class genofftime extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  genofftime.init({
    userid: DataTypes.INTEGER,
    duid: DataTypes.STRING,
    timetaken: DataTypes.TIME,
    datetaken: DataTypes.DATEONLY,
  }, {
    sequelize,
    modelName: 'genofftime',
  });
  return genofftime;
};