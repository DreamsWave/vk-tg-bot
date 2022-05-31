import os from 'os';
import { Post, TelegramSendEvent, VideoInfo, ImageInfo } from '@yc-bot/types';
import { getMediaFilesFromAttachments } from '@yc-bot/utils';
import { eventCreator } from './event-creator';

export interface createSendQueueOptions {
	randomFilenames?: boolean;
	destination?: string;
}

const createSendQueue = async (post: Post, options?: createSendQueueOptions): Promise<TelegramSendEvent[]> => {
	const destination = options?.destination ?? os.tmpdir();
	const randomFilenames = options?.randomFilenames ?? false;
	let eventQueue = [] as TelegramSendEvent[];
	if (!post) return eventQueue;
	const { text, attachments } = post;
	if (attachments?.length) {
		// Если имеются прикрепленные файлы, то обрабатываем их и получаем информацию о них
		const mediaFiles = await getMediaFilesFromAttachments(attachments, { destination, randomFilenames });
		// Если файлы обработались, то продолжаем работать с событиями
		if (mediaFiles.length) {
			if (mediaFiles.length === 1) {
				const mediaFile = mediaFiles[0];
				if (mediaFile.type === 'photo') {
					const sendEvents = await eventCreator('sendPhoto', text, mediaFiles);
					eventQueue = [...eventQueue, ...sendEvents];
				} else if (mediaFile.type === 'video') {
					const sendEvents = await eventCreator('sendVideo', text, mediaFiles);
					eventQueue = [...eventQueue, ...sendEvents];
				} else if (mediaFile.type === 'document') {
					const sendEvents = await eventCreator('sendDocument', text, mediaFiles);
					eventQueue = [...eventQueue, ...sendEvents];
				}
				// TODO:
				// sendAudio
				// sendAnimation(для GIF)
			} else {
				// Если есть документы, то отправляем отдельно
				const documents = mediaFiles.filter((m) => m.type === 'document');
				if (documents.length) {
					if (documents.length === 1) {
						// Если один документ, то отправляем через sendDocument
						const sendEvents = await eventCreator('sendDocument', text, documents);
						eventQueue = [...eventQueue, ...sendEvents];
					} else if (documents.length >= 2) {
						// Если больше 2х, то отправляем через sendMediaGroup
						const sendEvents = await eventCreator('sendMediaGroup', text, documents);
						eventQueue = [...eventQueue, ...sendEvents];
					}
				}
				// TODO: Если есть аудио, то отправляем отдельно
				// TODO: Если есть GIF, то отправляем отдельно

				// Если есть фото или видео, то отправляем отдельно
				const photosAndVideos = mediaFiles.filter((m) => m.type === 'video' || m.type === 'photo') as (VideoInfo | ImageInfo)[];
				if (photosAndVideos.length) {
					if (photosAndVideos.length === 1) {
						if (photosAndVideos[0].type === 'video') {
							const sendEvents = await eventCreator('sendVideo', text, photosAndVideos);
							eventQueue = [...eventQueue, ...sendEvents];
						} else if (photosAndVideos[0].type === 'photo') {
							const sendEvents = await eventCreator('sendPhoto', text, photosAndVideos);
							eventQueue = [...eventQueue, ...sendEvents];
						}
					} else if (photosAndVideos.length >= 2) {
						const sendEvents = await eventCreator('sendMediaGroup', text, photosAndVideos);
						eventQueue = [...eventQueue, ...sendEvents];
					}
				}
			}
		}
	} else {
		// Или если есть текст, то добавляем в очередь событие sendMessage
		if (text) {
			const sendEvents = await eventCreator('sendMessage', text);
			eventQueue = [...eventQueue, ...sendEvents];
		}
	}

	// Сделать первое сообщение с оповещением(остальные без оповещения)
	eventQueue[0].payload.options.disable_notification = false;
	return eventQueue;
};

export default createSendQueue;
