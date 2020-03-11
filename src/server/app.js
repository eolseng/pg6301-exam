const express = require('express');
const path = require('path');

const app = express();

// Serve static content from the public folder
app.use(express.static('public'));

app.use((req, res, next) => {
    res.sendFile(path.resolve(__dirname, '..', '..', 'public', 'index.html'));
});

module.exports = app;