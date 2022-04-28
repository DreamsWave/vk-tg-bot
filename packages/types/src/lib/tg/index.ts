import { Stream } from 'stream';

export type MediaType = {
	type: 'photo' | 'video' | 'document';
	media: string | Stream | Buffer;
	ext: string;
	duration?: number;
	height?: number;
	width?: number;
	thumb?: string | Stream | Buffer;
};
