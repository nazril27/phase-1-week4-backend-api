const express = require('express');
const router = require('../src/routes/index');

const app = express();

app.use(express.json());

app.use('/api', router);

app.get('/', (req, res) => {
    res.send('hello world');
});

module.exports = app;