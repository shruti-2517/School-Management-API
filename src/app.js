const express = require('express');

const schoolRoutes = require('./routes/schoolRoutes');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Server is running',
  });
});

app.use('/', schoolRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
