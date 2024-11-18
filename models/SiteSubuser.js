'use strict';
module.exports = (sequelize, DataTypes) => {
  const sitesubuser = sequelize.define('SiteSubuser', {
    siteid: DataTypes.INTEGER,
    subuserid: DataTypes.INTEGER
  }, {});
  sitesubuser.associate = function(models) {
     
  };
  return sitesubuser;
};