'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('tankdevices', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      gendeviceid: {
        type: Sequelize.INTEGER
      },
      siteid: {
        type: Sequelize.INTEGER
      },
      userid: {
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      duid: {
        type: Sequelize.STRING
      },
      gauge: {
        type: Sequelize.DOUBLE(10,2)
      },
      flowrate: {
        type: Sequelize.DOUBLE(10,2)
      },
      control: {
        type: Sequelize.INTEGER
      },
      voltage: {
        type: Sequelize.DECIMAL(10,2)
      },
      status: {
        type: Sequelize.INTEGER
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
    return queryInterface.dropTable('tankdevices');
  }
};