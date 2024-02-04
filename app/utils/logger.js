log4js = require('log4js');
log4js.configure('./log4js.json');
const logger = log4js.getLogger();

module.exports = logger;
