const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const errorHandler = require('./middlewares/errorHandler');
const logRoutes = require('./routes/logRoutes');

const app = express();

// Security and utility middlewares
app.use(helmet()); // Adds security headers
app.use(cors()); // Enables cross-origin requests
app.use(express.json()); // Parses incoming JSON payloads
app.use(morgan('dev')); // Logs HTTP requests

// API Routes
app.use('/api/v1/logs', logRoutes);

// Global Error Handler (must be the last middleware)
app.use(errorHandler);

module.exports = app;