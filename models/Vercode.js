'use strict';
module.exports = (sequelize, DataTypes) => {
  const Vercode = sequelize.define('Vercode', {
    email: DataTypes.STRING,
    code: DataTypes.STRING
  }, {});
  Vercode.associate = function(models) {
    // associations can be defined here
  };
  return Vercode;
};