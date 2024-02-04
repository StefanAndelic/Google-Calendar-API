const express = require('express');
const calendar = require('./routes/calendar');

//start the express app
const app = express();
app.use(express.json()); // for parsing application/json

app.get('/', (request, response) => {
  response.send(`Home page. Server time: ${new Date().toISOString()}`);
});

app.use('/api/calendar', calendar);

module.exports = app;
