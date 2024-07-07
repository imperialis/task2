// const express = require('express');
// const bodyParser = require('body-parser');
// const db = require('./models');
// const authRoutes = require('./routes/auth');
// const organisationRoutes = require('./routes/organisations');

// const app = express();

// app.use(bodyParser.json());

// app.use('/auth', authRoutes);
// app.use('/api', organisationRoutes);

// db.sequelize.sync();

// module.exports = app;

const express = require('express');
const bodyParser = require('body-parser');
const db = require('./models');
const authRoutes = require('./routes/auth');
const organisationRoutes = require('./routes/organisations');
const userRoutes = require('./routes/users');
const { v4: uuidv4 } = require('uuid'); // Import UUID generator

const app = express();

app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/api', organisationRoutes);
app.use('/api/users', userRoutes);
// Sync Sequelize models with the database
db.sequelize.sync().then(async () => {
  try {
    // Seed initial data or perform any additional setup here if needed
    console.log('Database synced successfully');

    // Example: Seed initial organisation with UUID
    const initialOrganisation = await db.Organisation.findOne();
    if (!initialOrganisation) {
      await db.Organisation.create({
        orgId: uuidv4(),
        name: 'Initial Organisation',
        description: 'This is the first organisation'
      });
      console.log('Initial organisation created');
    }
  } catch (error) {
    console.error('Error syncing database:', error);
  }
});

module.exports = app;

