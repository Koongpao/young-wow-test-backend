const app = require("./app");
const pool = require("./db");
require('dotenv').config();

PORT = process.env.SERVER_PORT || 3001;

(async () => {
  try {
    await pool.query('SELECT 1');
    console.log('Database connected successfully');
  } catch (err) {
    console.error('Failed to connect to the database:');
    console.error(err);
    process.exit(1);
  }
})();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
