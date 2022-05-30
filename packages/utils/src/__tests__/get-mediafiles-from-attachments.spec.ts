import { getAttachment } from '@yc-bot/mocks';
import { FileInfo, ImageInfo, VideoInfo } from '@yc-bot/types';
import path from 'path';
import { prepareTemp, getMediaFilesFromAttachments } from '..';
import * as download from '../lib/download';

describe('getMediafilesFromAttachments', () => {
	jest.setTimeout(60000);
	const destination = path.join(path.resolve(), 'tmp', 'getMediafilesFromAttachments');
	beforeAll(() => {
		prepareTemp(destination);
	});
	afterEach(() => {
		jest.clearAllMocks();
	});
	it('should return array with images info jpeg and webp(converted to jpeg)', async () => {
		const imagesInfo = [
			{
				ext: 'jpeg',
				filename: '5394614-70',
				mime: 'image/jpeg',
				path: 'D:\\Web\\yc-bot\\tmp\\getMediafilesFromAttachments\\5394614-70.jpeg',
				size: 2,
				type: 'photo',
				width: 150,
				height: 150,
				origin: 'https://sun9-87.userapi.com/s/v1/ig2/Iy_y8OKX_PlgX_5h6rufDfWggV3o9vSzqAUXqPvbD44MjEO7mG4VjoXD-ae_av0uHPcvJwyjb1_AmSziaWrG4OIV.jpg?size=150x150&quality=96&type=album'
			},
			{
				ext: 'jpeg',
				filename: 'c-3194661-70',
				mime: 'image/jpeg',
				path: 'D:\\Web\\yc-bot\\tmp\\getMediafilesFromAttachments\\c-3194661-70.jpeg',
				size: 37,
				type: 'photo',
				width: 550,
				height: 368,
				origin: 'https://www.gstatic.com/webp/gallery/1.webp'
			}
		] as ImageInfo[];
		jest.spyOn(download, 'downloadImage').mockResolvedValueOnce(imagesInfo[0]);
		jest.spyOn(download, 'downloadImage').mockResolvedValueOnce(imagesInfo[0]);
		const attachments = [getAttachment('photo', 'small'), getAttachment('photo', 'webp')];
		const mediafiles = await getMediaFilesFromAttachments(attachments, {
			randomFilenames: true,
			destination
		});
		expect(mediafiles).toHaveLength(2);
		for (const media of mediafiles) {
			expect(media.type).toBe('photo');
			expect(media.mime).toBe('image/jpeg');
			expect(media.path).toBeDefined();
			expect(media.origin).toBeDefined();
		}
	});
	it('should prepare vk and youtube videos', async () => {
		const videosInfo = [
			{
				ext: 'mp4',
				filename: 'c-9627137',
				mime: 'video/mp4',
				path: 'D:\\Web\\yc-bot\\tmp\\getMediafilesFromAttachments\\c-9627137.mp4',
				size: 563,
				type: 'video',
				thumb: {
					ext: 'jpeg',
					filename: '9627137-thumb-70',
					mime: 'image/jpeg',
					path: 'D:\\Web\\yc-bot\\tmp\\getMediafilesFromAttachments\\9627137-thumb-70.jpeg',
					size: 7,
					type: 'photo',
					width: 320,
					height: 180,
					origin: 'https://sun9-88.userapi.com/impf/c857320/v857320602/1531ef/c8qY_G8Tvmc.jpg?size=800x450&quality=96&keep_aspect_ratio=1&background=000000&sign=60e02e2400f456044bef4df2ae8a352c&type=video_thumb'
				},
				duration: 9,
				height: 480,
				width: 480,
				origin: 'https://m.vk.com/video-172967713_456240740'
			},
			{
				ext: 'mp4',
				filename: '7703503',
				mime: 'video/mp4',
				path: 'D:\\Web\\yc-bot\\tmp\\getMediafilesFromAttachments\\7703503.mp4',
				size: 331,
				type: 'video',
				thumb: {
					ext: 'jpeg',
					filename: 'c-7703503-thumb-70',
					mime: 'image/jpeg',
					path: 'D:\\Web\\yc-bot\\tmp\\getMediafilesFromAttachments\\c-7703503-thumb-70.jpeg',
					size: 7,
					type: 'photo',
					width: 320,
					height: 180,
					origin: 'https://i.ytimg.com/vi_webp/vy12D9bc48E/maxresdefault.webp'
				},
				duration: 9,
				height: 360,
				width: 640,
				origin: 'https://m.vk.com/video-191117934_456239081'
			}
		] as VideoInfo[];
		jest.spyOn(download, 'downloadVideo').mockResolvedValueOnce(videosInfo[0]);
		jest.spyOn(download, 'downloadVideo').mockResolvedValueOnce(videosInfo[1]);
		const attachments = [getAttachment('video', 'small'), getAttachment('video', 'youtube')];
		const mediafiles = await getMediaFilesFromAttachments(attachments, {
			randomFilenames: true,
			destination
		});
		expect(mediafiles).toHaveLength(2);
		for (const media of mediafiles) {
			expect(media.type).toBe('video');
			expect(media.mime).toBe('video/mp4');
			expect(media.path).toBeDefined();
		}
	});
	it('should prepare pdf and gif', async () => {
		const docsInfo = [
			{
				ext: 'pdf',
				filename: '8869131',
				mime: 'application/pdf',
				path: 'D:\\Web\\yc-bot\\tmp\\getMediafilesFromAttachments\\8869131.pdf',
				size: 4,
				type: 'document',
				origin: 'https://vk.com/doc11300623_634603469?hash=mHpnqiwnt91PjIJwsf7Z2k77dPsGRydarKgXmt3FaYs&dl=GEYTGMBQGYZDG:1650726424:mzo2Rw8lyeRx15rAUmk7ZF5fTzXlNvZEZfcu9lMbjwT&api=1&no_preview=1'
			},
			{
				ext: 'gif',
				filename: '1591989',
				mime: 'image/gif',
				path: 'D:\\Web\\yc-bot\\tmp\\getMediafilesFromAttachments\\1591989.gif',
				size: 182,
				type: 'document',
				origin: 'https://vk.com/doc11300623_634588582?hash=ZVf4gXnu5z3Cip9y1sp5dxXthozuIsWqa5Tu9toEjus&dl=GEYTGMBQGYZDG:1650715675:XD51jBLcAayC92roN4K0bI4h1zXu4zNC4QOZAtJbqVX&api=1&no_preview=1'
			}
		] as FileInfo[];
		jest.spyOn(download, 'downloadFile').mockResolvedValueOnce(docsInfo[0]);
		jest.spyOn(download, 'downloadFile').mockResolvedValueOnce(docsInfo[1]);
		const attachments = [getAttachment('doc', 'pdf'), getAttachment('doc', 'gif')];
		const mediafiles = await getMediaFilesFromAttachments(attachments, {
			randomFilenames: true,
			destination
		});
		expect(mediafiles).toHaveLength(2);
		expect(mediafiles[0].mime).toBe('application/pdf');
		expect(mediafiles[0].ext).toBe('pdf');
		expect(mediafiles[0].type).toBe('document');
		expect(mediafiles[1].mime).toBe('image/gif');
		expect(mediafiles[1].ext).toBe('gif');
		expect(mediafiles[1].type).toBe('document');
	});
});
