'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('phcndevicedata', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      siteid: {
        type: Sequelize.INTEGER
      },
      userid: {
        type: Sequelize.INTEGER
      },
      duid: {
        type: Sequelize.STRING
      },
      consumptionkw: {
        type: Sequelize.DOUBLE(10,2)
      },
      activepower: {
        type: Sequelize.DOUBLE(10,2)
      },
      consumptionkva: {
        type: Sequelize.DOUBLE(10,2)
      },
      activeenergy: {
        type: Sequelize.DOUBLE(10,2)
      },
      reactiveenergy: {
        type: Sequelize.DOUBLE(10,2)
      },
      cost: {
        type: Sequelize.DOUBLE(10,2)
      },
      uptime: {
        type: Sequelize.DOUBLE(20,4)
      },
      datetaken: {
        type: Sequelize.DATEONLY
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('phcndevicedata');
  }
};
