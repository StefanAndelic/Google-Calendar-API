const dotevn = require('dotenv');
const logger = require('./app/utils/logger.js');
const app = require('./app/app');
dotevn.config();

const port = process.env.PORT;

if (process.env.PORT || process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_SECRET || process.env.GOOGLE_REDIRECT_URL) {
  app.listen(port, () => {
    logger.info('Starting server...');
    logger.info(`Server listening on port ${port}`);
    logger.info(`http://localhost:${port}/api/calendar/da_li_je_slobodan`);
    logger.info(`GOOGLE_CLIENT_ID: ${process.env.GOOGLE_CLIENT_ID}`);
    logger.info(`GOOGLE_CLIENT_SECRET: ${process.env.GOOGLE_CLIENT_SECRET}`);
    logger.info(`GOOGLE_REDIRECT_URL: ${process.env.GOOGLE_REDIRECT_URL}`);
    logger.info(`REFRESH_TOKEN: ${process.env.REFRESH_TOKEN}`);
  });
} else {
  logger.debug('Please set the environment variables in the .env file');
}

module.exports = app;
