module.exports = (sequelize, Sequelize) => {
  const Contact = sequelize.define('Contact', {
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
  }, {
    freezeTableName: true,
    timestamps: false
  });
  Contact.associate = () => {
    // associations can be defined here
  };
  return Contact;
};
