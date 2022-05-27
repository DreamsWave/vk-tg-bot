import path from 'path';
import { getFileInfo, getImageInfo, prepareTemp } from '@yc-bot/utils';
import { createSendQueue } from '..';
import { vkEvents } from '@yc-bot/mocks';
import * as utils from '@yc-bot/utils';
import { VideoInfo } from '@yc-bot/types';
describe('createSendQueue', () => {
	let imageInfo;
	let videoInfo;
	let documentInfo;
	let gifInfo;

	jest.setTimeout(30000);
	const destination = path.join(path.resolve(), 'tmp/createSendQueue');

	beforeAll(async () => {
		prepareTemp(destination);
		imageInfo = await getImageInfo(path.join(path.resolve(), '/assets/image-jpeg.jpeg'));
		videoInfo = {
			...(await getFileInfo(path.join(path.resolve(), '/assets/video-youtube.mp4'))),
			width: 640,
			height: 360,
			duration: 1,
			thumb: await getImageInfo(path.join(path.resolve(), '/assets/image-video-thumb.jpeg')),
			type: 'video'
		} as VideoInfo;
		documentInfo = await getFileInfo(path.join(path.resolve(), '/assets/file-pdf.pdf'));
		gifInfo = await getFileInfo(path.join(path.resolve(), '/assets/file-gif.gif'));
	});

	it('should create queue with 1 sendMessage', async () => {
		const post = vkEvents.wallPostNew.simple.object;
		const queue = await createSendQueue(post, { destination, randomFilenames: true });
		expect(queue).toHaveLength(1);
		expect(queue[0].method).toBe('sendMessage');
	});
	it('should create queue with 2 sendMessage', async () => {
		const post = vkEvents.wallPostNew.withLongText.object;
		const queue = await createSendQueue(post, { destination, randomFilenames: true });
		expect(queue).toHaveLength(2);
		queue.forEach((el) => {
			expect(el.method).toBe('sendMessage');
		});
	});
	it('should create queue with 1 sendMediaGroup', async () => {
		jest.spyOn(utils, 'getMediaFilesFromAttachments').mockResolvedValue([imageInfo, videoInfo]);
		const post = vkEvents.wallPostNew.withPhotoAndVideo.object;
		const queue = await createSendQueue(post, { destination, randomFilenames: true });
		expect(queue).toHaveLength(1);
		expect(queue[0].method).toBe('sendMediaGroup');
		jest.clearAllMocks();
	});
	it('should create queue with 1 sendDocument and 1 sendMediaGroup', async () => {
		jest.spyOn(utils, 'getMediaFilesFromAttachments').mockResolvedValue([imageInfo, videoInfo, documentInfo]);
		const post = vkEvents.wallPostNew.withPhotoVideoDoc.object;
		const queue = await createSendQueue(post, { destination, randomFilenames: true });
		expect(queue).toHaveLength(2);
		expect(queue[0].method).toBe('sendDocument');
		expect(queue[1].method).toBe('sendMediaGroup');
		jest.clearAllMocks();
	});
	it('should create queue with 1 sendPhoto and 1 sendMessage', async () => {
		jest.spyOn(utils, 'getMediaFilesFromAttachments').mockResolvedValue([imageInfo]);
		const post = vkEvents.wallPostNew.withPhotoAndLongText.object;
		const queue = await createSendQueue(post, { destination, randomFilenames: true });
		expect(queue).toHaveLength(2);
		expect(queue[0].method).toBe('sendPhoto');
		expect(queue[1].method).toBe('sendMessage');
		jest.clearAllMocks();
	});
});
