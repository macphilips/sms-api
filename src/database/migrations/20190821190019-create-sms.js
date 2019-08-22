module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('SMS', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    senderId: {
      allowNull: true,
      type: Sequelize.INTEGER,
      onDelete: 'CASCADE',
      references: {
        model: 'Contact',
        key: 'id',
      },
    },
    reason: {
      allowNull: true,
      type: Sequelize.TEXT,
    },
    receiverId: {
      allowNull: true,
      type: Sequelize.INTEGER,
      onDelete: 'CASCADE',
      references: {
        model: 'Contact',
        key: 'id',
      },
    },
    message: {
      allowNull: false,
      type: Sequelize.TEXT(),
    },
    status: {
      type: Sequelize.STRING(150)
    }
  }),
  down: queryInterface => queryInterface.dropTable('SMS')
};
