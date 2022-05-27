import path from 'path';
import { prepareTemp } from '@yc-bot/utils';
import { createSendQueue } from '..';
import { vkEvents } from '@yc-bot/mocks';

describe('createSendQueue', () => {
	jest.setTimeout(30000);
	const destination = path.join(path.resolve(), 'tmp/createSendQueue');
	beforeAll(() => {
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
		const post = vkEvents.wallPostNew.withPhotoAndVideo.object;
		const queue = await createSendQueue(post, { destination, randomFilenames: true });
		expect(queue).toHaveLength(1);
		expect(queue[0].method).toBe('sendMediaGroup');
	});
	it('should create queue with 1 sendDocument and 1 sendMediaGroup', async () => {
		const post = vkEvents.wallPostNew.withPhotoVideoDoc.object;
		const queue = await createSendQueue(post, { destination, randomFilenames: true });
		expect(queue).toHaveLength(2);
		expect(queue[0].method).toBe('sendDocument');
		expect(queue[1].method).toBe('sendMediaGroup');
	});
});
