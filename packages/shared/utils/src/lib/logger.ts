import log4js from 'log4js';
log4js.configure({
	appenders: { console: { type: 'console', layout: { type: 'messagePassThrough' } } },
	categories: { default: { appenders: ['console'], level: 'all' } }
});
export const logger = log4js.getLogger();
logger.level = process.env.LOG_LEVEL || 'DEBUG';
