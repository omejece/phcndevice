'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('powertimes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userid: {
        type: Sequelize.INTEGER
      },
      siteid: {
        type: Sequelize.INTEGER
      },
      duid: {
        type: Sequelize.STRING
      },
      timetaken: {
        type: Sequelize.TIME
      },
      datetaken: {
        type: Sequelize.DATE
      },
      workingtimetaken: {
        type: Sequelize.TIME
      },
      workingdatetaken: {
        type: Sequelize.DATE
      },
      startingduration: {
        type: Sequelize.DOUBLE
      },
      status: {
        type: Sequelize.INTEGER
      },
      isactive: {
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
    return queryInterface.dropTable('powertimes');
  }
};