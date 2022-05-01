import log4js from 'log4js';
import { loremIpsum } from 'lorem-ipsum';
import chunk from 'chunk-text';

log4js.configure({
	appenders: { console: { type: 'console', layout: { type: 'basic' } } },
	categories: { default: { appenders: ['console'], level: 'all' } }
});
export const logger = log4js.getLogger();
logger.level = process.env.LOG_LEVEL || 'DEBUG';

export const chunkString = (str: string, size: number, firstElementSize?: number): string[] => {
	str = str.trim();
	if (firstElementSize) {
		const firstElementSizeChunks = chunk(str, firstElementSize);
		const restChunks = chunk(firstElementSizeChunks.slice(1).join(' '), size);
		return [firstElementSizeChunks[0], ...restChunks];
	}
	return chunk(str, size);
};

export const makeString = (size: number): string => {
	return loremIpsum({
		count: size,
		format: 'plain',
		units: 'words'
	}).substring(0, size);
};

export const makeID = (): number => Math.floor(Math.random() * 10000000);

export const createLinkedPhoto = (url: string): string => `<a href="${url}">­</a>`;
