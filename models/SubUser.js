'use strict';
module.exports = (sequelize, DataTypes) => {
  const SubUser = sequelize.define('SubUser', {
    apikey: DataTypes.STRING,
    userid: DataTypes.INTEGER,
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {});
  SubUser.associate = function(models) {
    SubUser.belongsTo(models.User);
  };
  return SubUser;
};