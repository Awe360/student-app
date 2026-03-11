const express = require('express');
const cors = require('cors');
const studentRoutes = require('./routes/student.routes');

const app = express();

// CORS — allow configured origins (or all origins in development)
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : '*';

app.use(
    cors({
        origin: allowedOrigins,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    })
);

// Body parsing middleware
app.use(express.json());

// ── Health endpoint (used by Kubernetes liveness & readiness probes) ──────────
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
    });
});

// ── Root info endpoint ────────────────────────────────────────────────────────
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Student API is running 🚀',
        version: '1.0.0',
        endpoints: {
            health: '/health',
            students: '/api/students',
        },
    });
});

// ── Student routes ────────────────────────────────────────────────────────────
app.use('/api/students', studentRoutes);

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.originalUrl} not found`,
    });
});

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
    });
});

module.exports = app;
