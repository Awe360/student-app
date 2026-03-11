const express = require('express');
const studentRoutes = require('./routes/student.routes');

const app = express();

// Middleware
app.use(express.json());

// Health check route
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Student API is running 🚀',
        version: '1.0.0',
    });
});

// Student routes
app.use('/api/students', studentRoutes);

// 404 handler for unknown routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.originalUrl} not found`,
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
    });
});

module.exports = app;
