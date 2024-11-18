'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('phcndevices', {
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
      name: {
        type: Sequelize.STRING
      },
      cost_per_kwh: {
        type: Sequelize.DOUBLE(20,2),
      },
      vat: {
        type: Sequelize.DECIMAL(20,2),
      },
      duid: {
        type: Sequelize.STRING
      },
      powerstatus: {
        type: Sequelize.DOUBLE(10,2)
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
      voltagea: {
        type: Sequelize.DOUBLE(10,2)
      },
      voltageb: {
        type: Sequelize.DOUBLE(10,2)
      },
      voltagec: {
        type: Sequelize.DOUBLE(10,2)
      },
      currenta: {
        type: Sequelize.DOUBLE(10,2)
      },
      currentb: {
        type: Sequelize.DOUBLE(10,2)
      },
      currentc: {
        type: Sequelize.DOUBLE(10,2)
      },
      powerfactora: {
        type: Sequelize.DOUBLE(10,2)
      },
      powerfactorb: {
        type: Sequelize.DOUBLE(10,2)
      },
      powerfactorc: {
        type: Sequelize.DOUBLE(10,2)
      },
      frequency: {
        type: Sequelize.DOUBLE(10,2)
      },
      sumactiveenergy: {
        type: Sequelize.DOUBLE(40,10)
      },
      totalactiveenergy: {
        type: Sequelize.DOUBLE(40,10)
      },
      previousuptime: {
        type: Sequelize.DOUBLE(10,2)
      },
      lastuptime: {
        type: Sequelize.DATE
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
    return queryInterface.dropTable('phcndevices');
  }
};