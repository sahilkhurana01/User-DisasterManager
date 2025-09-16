const express = require('express');
const app = express();
const PORT = 8080;

app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Test server running' });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Test server running on http://localhost:${PORT}`);
});

app.on('error', (err) => {
    console.error('Server error:', err);
});
