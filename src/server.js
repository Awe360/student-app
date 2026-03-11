const app = require('./app');

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
    console.log(`✅ Student API server is running on http://localhost:${PORT}`);
    console.log(`📚 API Base URL: http://localhost:${PORT}/api/students`);
});
