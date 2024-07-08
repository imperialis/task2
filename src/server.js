require('dotenv').config();
// require('dotenv').config({ path: './src/.env' });

const app = require('./app');

const PORT = process.env.PORT || 3000;

const DB_HOST = process.env.DB_HOST;
const DB_NAME = process.env.DB_NAME;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Connected to database at ${DB_HOST}/${DB_NAME}`);
});

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
