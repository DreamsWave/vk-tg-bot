import { handler } from '../main';
import { getAttachment, ymq } from '@yc-bot/mocks';
import { Messages, Post, VKEvent } from '@yc-bot/types';
import path from 'path';
import { makeString, Temp } from '@yc-bot/utils';

const createMessagesWithPost = ({ text, attachments }: { text?: string; attachments? }): Messages => {
	const messages: Messages = ymq.messages;
	const vkEvent = JSON.parse(messages.messages[0].details.message.body) as VKEvent;
	const post = vkEvent.object as Post;
	post.text = text ?? '';
	post.attachments = attachments ?? [];
	vkEvent.object = post;
	messages.messages[0].details.message.body = JSON.stringify(vkEvent);
	return messages;
};

describe('wall-post-new e2e', () => {
	jest.setTimeout(30000);
	const destination = path.join(path.resolve(), 'tmp', 'wall-post-new-e2e');
	beforeAll(() => {
		Temp.setTmpdir(destination);
		// Temp.prepare();
	});
	afterAll(() => {
		Temp.removeLocation();
		Temp.cleanTmpdir();
	});
	// it.only('only', () => expect(true).toBe(true));
	// TEXT
	it('should send post with text only', async () => {
		try {
			const text = 'should send post with text only \n' + makeString(100);
			const attachments = [];
			const messages = createMessagesWithPost({ text, attachments });
			const result = await handler(messages, {});
			expect(result.body).toBe('ok');
			expect(result.statusCode).toBe(200);
		} catch (error) {
			expect(false).toBe(true);
		}
	});
	it('should send post with long text only', async () => {
		try {
			const text = 'should send post with long text only \n' + makeString(5000);
			const attachments = [];
			const messages = createMessagesWithPost({ text, attachments });
			const result = await handler(messages, {});
			expect(result.body).toBe('ok');
			expect(result.statusCode).toBe(200);
		} catch (error) {
			expect(false).toBe(true);
		}
	});
	it('should send post with photo only', async () => {
		try {
			const text = '';
			const attachments = [getAttachment('photo', 'small')];
			const messages = createMessagesWithPost({ text, attachments });
			const result = await handler(messages, {});
			expect(result.body).toBe('ok');
			expect(result.statusCode).toBe(200);
		} catch (error) {
			expect(false).toBe(true);
		}
	});
	// PHOTO
	it('should send post with photo and text', async () => {
		try {
			const text = 'should send post with photo and text \n' + makeString(100);
			const attachments = [getAttachment('photo', 'small')];
			const messages = createMessagesWithPost({ text, attachments });
			const result = await handler(messages, {});
			expect(result.body).toBe('ok');
			expect(result.statusCode).toBe(200);
		} catch (error) {
			expect(false).toBe(true);
		}
	});
	it('should send post with photo and medium text', async () => {
		try {
			const text = 'should send post with photo and medium text \n' + makeString(1200);
			const attachments = [getAttachment('photo', 'small')];
			const messages = createMessagesWithPost({ text, attachments });
			const result = await handler(messages, {});
			expect(result.body).toBe('ok');
			expect(result.statusCode).toBe(200);
		} catch (error) {
			expect(false).toBe(true);
		}
	});
	it('should send post with photo and long text', async () => {
		try {
			const text = 'should send post with photo and long text \n' + makeString(5000);
			const attachments = [getAttachment('photo', 'small')];
			const messages = createMessagesWithPost({ text, attachments });
			const result = await handler(messages, {});
			expect(result.body).toBe('ok');
			expect(result.statusCode).toBe(200);
		} catch (error) {
			expect(false).toBe(true);
		}
	});
	// VIDEO
	it('should send post with video only', async () => {
		try {
			const text = '';
			const attachments = [getAttachment('video', 'small')];
			const messages = createMessagesWithPost({ text, attachments });
			const result = await handler(messages, {});
			expect(result.body).toBe('ok');
			expect(result.statusCode).toBe(200);
		} catch (error) {
			expect(false).toBe(true);
		}
	});
	it('should send post with video and text', async () => {
		try {
			const text = 'should send post with video and text \n' + makeString(100);
			const attachments = [getAttachment('video', 'small')];
			const messages = createMessagesWithPost({ text, attachments });
			const result = await handler(messages, {});
			expect(result.body).toBe('ok');
			expect(result.statusCode).toBe(200);
		} catch (error) {
			expect(false).toBe(true);
		}
	});
	it('should send post with video and medium text', async () => {
		try {
			const text = 'should send post with video and medium text \n' + makeString(1200);
			const attachments = [getAttachment('video', 'small')];
			const messages = createMessagesWithPost({ text, attachments });
			const result = await handler(messages, {});
			expect(result.body).toBe('ok');
			expect(result.statusCode).toBe(200);
		} catch (error) {
			expect(false).toBe(true);
		}
	});
	it('should send post with video and long text', async () => {
		try {
			const text = 'should send post with video and long text \n' + makeString(4200);
			const attachments = [getAttachment('video', 'small')];
			const messages = createMessagesWithPost({ text, attachments });
			const result = await handler(messages, {});
			expect(result.body).toBe('ok');
			expect(result.statusCode).toBe(200);
		} catch (error) {
			expect(false).toBe(true);
		}
	});
	// MediaGroup
	it('should send post with 2 photos as media group only', async () => {
		try {
			const text = '';
			const attachments = [getAttachment('photo', 'small'), getAttachment('photo', 'small')];
			const messages = createMessagesWithPost({ text, attachments });
			const result = await handler(messages, {});
			expect(result.body).toBe('ok');
			expect(result.statusCode).toBe(200);
		} catch (error) {
			expect(false).toBe(true);
		}
	});
	// FIX IT
	it('should send post with 2 photos as media group and text', async () => {
		try {
			const text = 'should send post with 2 photos as media group and text \n' + makeString(100);
			const attachments = [getAttachment('photo', 'small'), getAttachment('photo', 'normal')];
			const messages = createMessagesWithPost({ text, attachments });
			const result = await handler(messages, {});
			expect(result.body).toBe('ok');
			expect(result.statusCode).toBe(200);
		} catch (error) {
			expect(false).toBe(true);
		}
	});
	it('should send post with 2 photos as media group and medium text', async () => {
		try {
			const text = 'should send post with 2 photos as media group and medium text \n' + makeString(1200);
			const attachments = [getAttachment('photo', 'small'), getAttachment('photo', 'small')];
			const messages = createMessagesWithPost({ text, attachments });
			const result = await handler(messages, {});
			expect(result.body).toBe('ok');
			expect(result.statusCode).toBe(200);
		} catch (error) {
			expect(false).toBe(true);
		}
	});
	it('should send post with 2 photos as media group and long text', async () => {
		try {
			const text = 'should send post with 2 photos as media group and long text \n' + makeString(4200);
			const attachments = [getAttachment('photo', 'small'), getAttachment('photo', 'small')];
			const messages = createMessagesWithPost({ text, attachments });
			const result = await handler(messages, {});
			expect(result.body).toBe('ok');
			expect(result.statusCode).toBe(200);
		} catch (error) {
			expect(false).toBe(true);
		}
	});
});
