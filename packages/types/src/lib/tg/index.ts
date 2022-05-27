export * from './send-queue';
import { Stream } from 'stream';

export type MediaType = {
	type: 'photo' | 'video' | 'document';
	media: string | Stream | Buffer;
	ext: string;
	duration?: number;
	height?: number;
	width?: number;
	thumb?: string | Stream | Buffer;
	origin?: string;
};

export type InputTypes = 'photo' | 'video' | 'document' | 'audio';
export interface InputMedia {
	type: InputTypes;
	media: string | Stream | Buffer;
	ext?: string;
	origin?: string;
	caption?: string;
	parse_mode?: 'Markdown' | 'MarkdownV2' | 'HTML';
	caption_entitites?: [unknown];
}

export interface InputMediaPhoto extends InputMedia {
	type: 'photo';
}

export interface InputMediaVideo extends InputMedia {
	type: 'video';
	thumb?: string | Stream | Buffer;
	width?: number;
	height?: number;
	duration?: number;
	supports_streaming?: boolean;
}
export interface InputMediaDocument extends InputMedia {
	type: 'document';
	thumb?: string | Stream | Buffer;
	disable_content_type_detection?: boolean;
}
export interface InputMediaAudio extends InputMedia {
	type: 'audio';
	duration?: number;
	performer?: string;
	title?: string;
	thumb?: string | Stream | Buffer;
}
