require('dotenv').config();
const app = require('./app');
const setup = require('./config/setupDatabase');

const PORT = process.env.PORT || 3000;

setup()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Startup error during DB setup:', err.message);
    // Start server anyway so Railway does not crash-loop
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} (DB setup failed)`);
    });
  });
