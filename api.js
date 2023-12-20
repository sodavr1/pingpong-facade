const express = require('express');
const path = require('path');

const api = express();

api.use(express.static(path.join(__dirname, 'public')));
api.use(express.static(path.join(__dirname, 'screens')));

api.use('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
});

api.use('/screens', (req, res) => {
    res.sendFile(path.join(__dirname, 'screens', 'screenE.html'))
});

module.exports = api;