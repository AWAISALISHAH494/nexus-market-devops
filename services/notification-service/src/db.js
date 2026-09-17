const { Sequelize } = require('sequelize');

const postgresURI = process.env.DATABASE_URL || 'postgres://postgres:password@localhost:5432/nexus_market';

const sequelize = new Sequelize(postgresURI, {
  logging: false,
});

module.exports = sequelize;
