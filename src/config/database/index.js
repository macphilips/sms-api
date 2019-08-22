require('dotenv').config();

const defaultConfig = {
  url: process.env.DATABASE_URL,
  dialect: 'postgres',
  define: {
    // prevent sequelize from pluralizing table names
    freezeTableName: true,
    timestamps: false,
    underscored: true,
  }
};

const testConfig = {
  ...defaultConfig,
  url: process.env.TEST_DATABASE_URL,
};

module.exports = {
  test: testConfig,
  development: defaultConfig,
  production: defaultConfig
};
