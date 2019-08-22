module.exports = (sequelize, Sequelize) => {
  const SMS = sequelize.define('SMS', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    senderId: {
      allowNull: true,
      type: Sequelize.INTEGER
    },
    receiverId: {
      allowNull: true,
      type: Sequelize.INTEGER
    },
    message: {
      allowNull: false,
      type: Sequelize.TEXT,
    },
    reason: {
      allowNull: true,
      type: Sequelize.TEXT,
    },
    status: {
      type: Sequelize.STRING(150)
    }
  }, {
    freezeTableName: true,
    // underscored: true,
    timestamps: false
  });
  SMS.associate = (models) => {
    // associations can be defined here
    SMS.belongsTo(models.Contact, {
      foreignKey: 'senderId',
      targetKey: 'id',
      as: 'sender'
    });
    SMS.belongsTo(models.Contact, {
      foreignKey: 'receiverId',
      targetKey: 'id',
      as: 'receiver'
    });
  };
  return SMS;
};
