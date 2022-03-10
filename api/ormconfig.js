module.exports = {
  type: 'mysql',
  host: 'db',
  port: 3306,
  username: 'user',
  password: 'root',
  database: 'interestCityDB',
  logging: false,
  entities: ['dist/**/entities/*.entity.js'],
  migrations: ['dist/**/database/migrations/**/*.js'],
  subscribers: ['src/subscriber/**/*.ts'],
  cli: {
    entitiesDir: 'src/entities',
    migrationsDir: 'src/database/migrations',
  },
};
