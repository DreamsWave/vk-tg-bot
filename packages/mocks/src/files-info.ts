import { FileInfo, ImageInfo, VideoInfo } from '@yc-bot/types';

export const fileGif: FileInfo = {
	ext: 'gif',
	filename: 'file-gif',
	mime: 'image/gif',
	path: 'D:\\Web\\yc-bot\\assets\\file-gif.gif',
	size: 32,
	type: 'document',
	origin: 'https://some-origin-url.com/file'
};
export const filePdf: FileInfo = {
	ext: 'pdf',
	filename: 'file-pdf',
	mime: 'application/pdf',
	path: 'D:\\Web\\yc-bot\\assets\\file-pdf.pdf',
	size: 14,
	type: 'document',
	origin: 'https://some-origin-url.com/file'
};
export const imageBig: ImageInfo = {
	ext: 'jpeg',
	filename: 'image-big',
	mime: 'image/jpeg',
	path: 'D:\\Web\\yc-bot\\assets\\image-big.jpeg',
	size: 21,
	type: 'photo',
	height: 1000,
	width: 1000,
	origin: 'https://via.placeholder.com/1000.jpeg'
};
export const imageJpeg: ImageInfo = {
	ext: 'jpeg',
	filename: 'image-jpeg',
	mime: 'image/jpeg',
	path: 'D:\\Web\\yc-bot\\assets\\image-jpeg.jpeg',
	size: 2,
	type: 'photo',
	height: 150,
	width: 150,
	origin: 'https://via.placeholder.com/150.jpeg'
};
export const imageVideoThumb: ImageInfo = {
	ext: 'jpeg',
	filename: 'image-video-thumb',
	mime: 'image/jpeg',
	path: 'D:\\Web\\yc-bot\\assets\\image-video-thumb.jpeg',
	size: 4,
	type: 'photo',
	height: 150,
	width: 150,
	origin: 'https://via.placeholder.com/150.jpeg'
};
export const imageWebp: ImageInfo = {
	ext: 'webp',
	filename: 'image-webp',
	mime: 'image/webp',
	path: 'D:\\Web\\yc-bot\\assets\\image-webp.webp',
	size: 1,
	type: 'photo',
	height: 150,
	width: 150,
	origin: 'https://via.placeholder.com/150.webp'
};
export const videoMp4: VideoInfo = {
	ext: 'mp4',
	filename: 'video-mp4',
	mime: 'video/mp4',
	path: 'D:\\Web\\yc-bot\\assets\\video-mp4.mp4',
	size: 544,
	type: 'video',
	duration: 30,
	height: 240,
	width: 320,
	thumb: {
		ext: 'jpeg',
		filename: 'image-video-thumb',
		mime: 'image/jpeg',
		path: 'D:\\Web\\yc-bot\\assets\\image-video-thumb.jpeg',
		size: 4,
		type: 'photo',
		height: 150,
		width: 150,
		origin: 'https://some-origin-url.com/file'
	},
	origin: 'https://some-origin-url.com/file'
};
export const videoVk: VideoInfo = {
	ext: 'mp4',
	filename: 'video-vk',
	mime: 'video/mp4',
	path: 'D:\\Web\\yc-bot\\assets\\video-vk.mp4',
	size: 15,
	type: 'video',
	duration: 1,
	height: 360,
	width: 640,
	thumb: {
		ext: 'jpeg',
		filename: 'image-video-thumb',
		mime: 'image/jpeg',
		path: 'D:\\Web\\yc-bot\\assets\\image-video-thumb.jpeg',
		size: 4,
		type: 'photo',
		height: 150,
		width: 150,
		origin: 'https://some-origin-url.com/file'
	},
	origin: 'https://some-origin-url.com/file'
};
export const videoYoutube: VideoInfo = {
	ext: 'mp4',
	filename: 'video-youtube',
	mime: 'video/mp4',
	path: 'D:\\Web\\yc-bot\\assets\\video-youtube.mp4',
	size: 19,
	type: 'video',
	duration: 1,
	height: 360,
	width: 640,
	thumb: {
		ext: 'jpeg',
		filename: 'image-video-thumb',
		mime: 'image/jpeg',
		path: 'D:\\Web\\yc-bot\\assets\\image-video-thumb.jpeg',
		size: 4,
		type: 'photo',
		height: 150,
		width: 150,
		origin: 'https://some-origin-url.com/file'
	},
	origin: 'https://some-origin-url.com/file'
};
