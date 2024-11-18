'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('gendevices', {
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
      gendeviceid: {
        type: Sequelize.INTEGER
      },
      sensortype: {
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
      gauge2: {
        type: Sequelize.DOUBLE(10,2)
      },
      clearance: {
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
      tankheight: {
        type: Sequelize.DOUBLE(10,2)
      },
      status: {
        type: Sequelize.INTEGER
      },
      lastupdated: {
        allowNull: false,
        type: Sequelize.DATE
      },
      gpstimestamp: {
        allowNull: false,
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
    return queryInterface.dropTable('gendevices');
  }
};