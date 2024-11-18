'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('phcnontimes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      duid: {
        type: Sequelize.STRING
      },
      starttime: {
        type: Sequelize.DATE
      },
      datetaken: {
        type: Sequelize.DATEONLY
      },
      runtime: {
        type: Sequelize.DOUBLE(20,4)
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('phcnontimes');
  }
};