import path from 'path';
import { makeString, prepareTemp } from '@yc-bot/utils';
import { filesInfo } from '@yc-bot/mocks';
import { MAX_CAPTION_TEXT_LENGTH, MAX_MESSAGE_TEXT_LENGTH } from '../lib/constants';
import Queue from '../lib/Queue';
import * as utils from '@yc-bot/utils';
describe('Queue', () => {
	jest.setTimeout(30000);
	const destination = path.join(path.resolve(), 'tmp/Queue');
	beforeAll(async () => {
		prepareTemp(destination);
	});
	afterEach(() => jest.clearAllMocks());

	it('should add each type of files in queue', () => {
		const queue = new Queue();
		const mediaFiles = [filesInfo.imageJpeg, filesInfo.videoVk, filesInfo.fileGif, filesInfo.filePdf];
		for (const file of mediaFiles) {
			queue.addFiles([file]);
		}
		const queueEvents = queue.getQueue();
		expect(queueEvents[0].method).toBe('sendPhoto');
		expect(queueEvents[1].method).toBe('sendVideo');
		expect(queueEvents[2].method).toBe('sendAnimation');
		expect(queueEvents[3].method).toBe('sendDocument');
		// expect(queueEvents[4].method).toBe('sendAudio');
	});
	it('should add events with order sendAnimation, sendDocument, sendMediaGroup', () => {
		const queue = new Queue();
		const mediaFiles = [filesInfo.imageJpeg, filesInfo.videoVk, filesInfo.fileGif, filesInfo.filePdf];
		queue.addFiles(mediaFiles);
		const queueEvents = queue.getQueue();
		expect(queueEvents[0].method).toBe('sendAnimation');
		expect(queueEvents[1].method).toBe('sendDocument');
		expect(queueEvents[2].method).toBe('sendMediaGroup');
	});
	it('should add text', async () => {
		const queue = new Queue();
		await queue.addText(makeString(1000));
		expect(queue.getQueue()[0].method).toBe('sendMessage');
		expect(queue.getQueue()[0].payload.content.text.length).toBeLessThanOrEqual(1000);
		queue.clearQueue();
		await queue.addText(makeString(5000));
		expect(queue.getQueue()[0].method).toBe('sendMessage');
		expect(queue.getQueue()[0].payload.content.text.length).toBeGreaterThan(0);
		expect(queue.getQueue()[0].payload.content.text.length).toBeLessThanOrEqual(MAX_MESSAGE_TEXT_LENGTH);
		expect(queue.getQueue()[1].method).toBe('sendMessage');
		expect(queue.getQueue()[1].payload.content.text.length).toBeGreaterThan(0);
		expect(queue.getQueue()[1].payload.content.text.length).toBeLessThanOrEqual(MAX_MESSAGE_TEXT_LENGTH);
	});
	it('should add caption in sendPhoto and add sendMessage event', async () => {
		const queue = new Queue();
		const mediaFiles = [filesInfo.imageJpeg];

		queue.addFiles(mediaFiles);
		await queue.addText(makeString(1000));
		let queueEvents = queue.getQueue();
		expect(queueEvents[0].method).toBe('sendPhoto');
		expect(queueEvents[0].payload.options.caption.length).toBeGreaterThan(0);
		expect(queueEvents[0].payload.options.caption.length).toBeLessThanOrEqual(MAX_CAPTION_TEXT_LENGTH);
		queue.clearQueue();

		queue.addFiles(mediaFiles);
		await queue.addText(makeString(5000));
		queueEvents = queue.getQueue();
		expect(queueEvents[0].method).toBe('sendPhoto');
		expect(queueEvents[0].payload.options.caption.length).toBeGreaterThan(0);
		expect(queueEvents[0].payload.options.caption.length).toBeLessThanOrEqual(MAX_CAPTION_TEXT_LENGTH);
		expect(queueEvents[1].method).toBe('sendMessage');
		expect(queueEvents[1].payload.content.text.length).toBeGreaterThan(0);
		expect(queueEvents[1].payload.content.text.length).toBeLessThanOrEqual(MAX_MESSAGE_TEXT_LENGTH);
	});
	it('should add notification', async () => {
		const queue = new Queue();
		await queue.addText(makeString(10000));
		const eventQueue = queue.getQueue();
		for (let i = 0; i < eventQueue.length; i++) {
			const disable_notification = eventQueue[i].payload.options.disable_notification;
			expect(disable_notification).toBeTruthy();
		}
		queue.addNotification();
		for (let i = 0; i < eventQueue.length; i++) {
			const disable_notification = eventQueue[i].payload.options.disable_notification;
			if (i === 0) {
				expect(disable_notification).toBeFalsy();
			} else {
				expect(disable_notification).toBeTruthy();
			}
		}
		queue.addNotification({ all: true });
		for (let i = 0; i < eventQueue.length; i++) {
			const disable_notification = eventQueue[i].payload.options.disable_notification;
			expect(disable_notification).toBeFalsy();
		}
	});
	it('should move photo to the bottom of sendMessage', async () => {
		jest.spyOn(utils, 'createLinkedPhoto').mockResolvedValue('<a href="https://vk.cc/cdXIpW">­</a>');
		const queue = new Queue();
		const mediaFiles = [filesInfo.imageJpeg];

		queue.addFiles(mediaFiles);
		await queue.addText(makeString(3000));
		const queueEvents = queue.getQueue();
		expect(queueEvents[0].method).toBe('sendMessage');
		expect(queueEvents[0].payload.content.text.length).toBeGreaterThan(MAX_CAPTION_TEXT_LENGTH);
		expect(queueEvents[0].payload.content.text.length).toBeLessThanOrEqual(MAX_MESSAGE_TEXT_LENGTH);
		expect(queueEvents[0].payload.content.text.includes('<a href=')).toBeTruthy();
	});
});
