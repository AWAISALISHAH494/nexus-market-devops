const { Sequelize } = require('sequelize');

let sequelize;

if (process.env.NODE_ENV === 'test') {
  sequelize = new Sequelize('sqlite::memory:', { logging: false });
} else {
  const postgresURI = process.env.DATABASE_URL || 'postgres://postgres:password@localhost:5432/nexus_market';
  sequelize = new Sequelize(postgresURI, { logging: false });
}

module.exports = sequelize;
