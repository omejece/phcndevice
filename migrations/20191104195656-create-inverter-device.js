'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('inverterdevices', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      siteid: {
        type: Sequelize.INTEGER
      },
      duid: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      userid: {
        type: Sequelize.INTEGER
      },
      voltage: {
        type: Sequelize.DOUBLE(10,2)
      },
      control: {
        type: Sequelize.INTEGER
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
    return queryInterface.dropTable('inverterdevices');
  }
};