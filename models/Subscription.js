'use strict';
module.exports = (sequelize, DataTypes) => {
  const Subscription = sequelize.define('Subscription', {
    userid: DataTypes.INTEGER,
    startdate: DataTypes.DATE,
    enddate: DataTypes.DATE
  }, {});
  Subscription.associate = function(models) {
    Subscription.belongsTo(models.User);
  };
  return Subscription;
};