export interface FileInfo {
	type: 'photo' | 'video' | 'document' | 'audio';
	mime: string;
	size: number;
	path: string;
	ext: string;
	filename: string;
	origin?: string;
}
export interface ImageInfo extends FileInfo {
	height: number;
	width: number;
}
export interface VideoInfo extends FileInfo {
	height: number;
	width: number;
	duration: number;
	thumb: ImageInfo;
}

export interface AudioInfo extends FileInfo {
	duration: number;
	artist: string;
	title: string;
}

export type Files = (FileInfo | ImageInfo | VideoInfo | AudioInfo)[];

export type FileType = FileInfo | ImageInfo | VideoInfo | AudioInfo;

export type ResizeOptions = {
	maxWidth?: number;
	maxHeight?: number;
	maxSize?: number;
	quality?: number;
};
