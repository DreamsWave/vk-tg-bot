import { getLogger } from 'log4js';

export const logger = getLogger();

logger.level = process.env.LOG_LEVEL || 'DEBUG';
