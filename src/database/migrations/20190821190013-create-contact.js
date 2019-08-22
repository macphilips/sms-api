
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Contact', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    name: {
      type: Sequelize.STRING(50)
    },
    phoneNumber: {
      type: Sequelize.STRING(100)
    }
  }),
  down: queryInterface => queryInterface.dropTable('Contact')
};
