'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('fconsumptions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      duid: {
        type: Sequelize.STRING
      },
      userid: {
        type: Sequelize.INTEGER
      },
      siteid: {
        type: Sequelize.INTEGER
      },
      consumption: {
        type: Sequelize.DOUBLE(10,2)
      },
      datetaken: {
        type: Sequelize.DATE
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
    return queryInterface.dropTable('fconsumptions');
  }
};