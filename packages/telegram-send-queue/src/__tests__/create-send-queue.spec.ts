import path from 'path';
import { prepareTemp } from '@yc-bot/utils';
import { createSendQueue } from '..';
import { filesInfo, vkEvents } from '@yc-bot/mocks';
import * as utils from '@yc-bot/utils';
import { MAX_CAPTION_TEXT_LENGTH, MAX_MESSAGE_TEXT_LENGTH } from '../lib/constants';
describe('createSendQueue', () => {
	jest.setTimeout(30000);
	const destination = path.join(path.resolve(), 'tmp/createSendQueue');
	beforeAll(async () => {
		prepareTemp(destination);
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
		jest.spyOn(utils, 'getMediaFilesFromAttachments').mockResolvedValue([filesInfo.imageJpeg, filesInfo.videoVk]);
		const post = vkEvents.wallPostNew.withPhotoAndVideo.object;
		const queue = await createSendQueue(post, { destination, randomFilenames: true });
		expect(queue).toHaveLength(1);
		expect(queue[0].method).toBe('sendMediaGroup');
		jest.clearAllMocks();
	});
	it('should create queue with 1 sendDocument and 1 sendMediaGroup', async () => {
		jest.spyOn(utils, 'getMediaFilesFromAttachments').mockResolvedValue([filesInfo.imageJpeg, filesInfo.videoVk, filesInfo.filePdf]);
		const post = vkEvents.wallPostNew.withPhotoVideoDoc.object;
		const queue = await createSendQueue(post, { destination, randomFilenames: true });
		expect(queue).toHaveLength(2);
		expect(queue[0].method).toBe('sendDocument');
		expect(queue[1].method).toBe('sendMediaGroup');
		jest.clearAllMocks();
	});
	it('should create queue with 1 sendPhoto and 2 sendMessage', async () => {
		jest.spyOn(utils, 'getMediaFilesFromAttachments').mockResolvedValue([filesInfo.imageBig]);
		jest.spyOn(utils, 'createLinkedPhoto').mockResolvedValue('https://vk.cc/cdXIpW');
		const post = vkEvents.wallPostNew.withPhotoAndLongText.object;
		const queue = await createSendQueue(post, { destination, randomFilenames: true });
		expect(queue).toHaveLength(3);
		expect(queue[0].method).toBe('sendPhoto');
		expect(queue[0].payload.content.media).toBeTruthy();
		expect(queue[0].payload.options.caption?.length).toBeLessThan(MAX_CAPTION_TEXT_LENGTH);
		expect(queue[1].method).toBe('sendMessage');
		expect(queue[1].payload.content.text.length).toBeGreaterThan(1);
		expect(queue[1].payload.content.text.length).toBeLessThan(MAX_MESSAGE_TEXT_LENGTH);
		expect(queue[2].method).toBe('sendMessage');
		expect(queue[2].payload.content.text.length).toBeGreaterThan(1);
		expect(queue[2].payload.content.text.length).toBeLessThan(MAX_MESSAGE_TEXT_LENGTH);
		jest.clearAllMocks();
	});
});
