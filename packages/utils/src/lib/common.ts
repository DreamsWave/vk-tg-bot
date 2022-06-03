import {} from 'vk-io';
import fetch from 'node-fetch';
import { loremIpsum } from 'lorem-ipsum';
import chunk from 'chunk-text';
import { getShortLink } from '@yc-bot/api/vk';

export const calculateImageDimensions = (width: number, height: number, maxWidth: number, maxHeight: number): { width: number; height: number } => {
	if (width > height) {
		if (width > maxWidth) {
			height = Math.round((height *= maxWidth / width));
			width = maxWidth;
		}
	} else {
		if (height > maxHeight) {
			width = Math.round((width *= maxHeight / height));
			height = maxHeight;
		}
	}
	return { width, height };
};

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

export const makeID = (): string => String(Math.floor(Math.random() * 10000000));

export const getLargeSizeUrl = (sizes): string => {
	const SMALL_SIZES = ['m', 's'];
	const MEDIUM_SIZES = ['y', 'r', 'q', 'p', ...SMALL_SIZES];
	const LARGE_SIZES = ['w', 'z', ...MEDIUM_SIZES];
	if (!sizes) {
		return null;
	}
	return LARGE_SIZES.map((sizeType) => sizes.find((size) => size.type === sizeType)).filter(Boolean)[0].url;
};

export const createLinkedPhoto = (url: string): string => {
	if (url) return `<a href="${url}">­</a>`;
	return '';
};
