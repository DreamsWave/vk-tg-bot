import { Messages, Context, VKEvent, Post } from '@yc-bot/types';
import { sendQueue } from '@yc-bot/api/telegram';
import { Config } from '@yc-bot/shared/config';
import { Queue } from '@yc-bot/queue';
import { getMediaFilesFromAttachments, Temp } from '@yc-bot/utils';

export const handler = async (messages: Messages, context: Context) => {
	try {
		for (const message of messages.messages) {
			const event: VKEvent = JSON.parse(message.details.message.body) ?? '';
			const post = event.object as Post;

			if (post.marked_as_ads) continue;
			if (post.post_type !== 'post') continue;

			const config = await Config.init(event?.group_id);
			if (!config) return { statusCode: 200, body: 'ok' };

			const queue = new Queue();
			if (post.attachments?.length) {
				// Remove FOR when youtube-dl will be fixed https://github.com/ytdl-org/youtube-dl/issues/31035
				for (const attachement of post.attachments) {
					if (attachement.type === 'video') {
						console.log('Post has video');
						return {
							statusCode: 200,
							body: 'ok'
						};
					}
				}

				Temp.prepare();
				const mediaFiles = await getMediaFilesFromAttachments(post.attachments);
				if (post.attachments.length > 0 && mediaFiles?.length === 0) throw 'Missing files';
				if (post.attachments.length === 1 && mediaFiles?.length !== 1) throw 'Missing file';
				queue.addFiles(mediaFiles);
			}
			if (post.text) {
				queue.addText(post.text);
			}
			queue.addNotification();
			await sendQueue(queue.getQueue());
		}
	} catch (error) {
		console.error(JSON.stringify(error));
	} finally {
		Temp.removeLocation();
	}
	return {
		statusCode: 200,
		body: 'ok'
	};
};
