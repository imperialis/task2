const db = require('../models');

beforeAll(async () => {
  await db.sequelize.sync({ force: false });
});

afterAll(async () => {
  await db.sequelize.close();
});
