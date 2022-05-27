import os from 'os';
import { Post, TelegramSendEvent, Files, VideoInfo, ImageInfo } from '@yc-bot/types';
import { getMediaFilesFromAttachments } from '@yc-bot/utils';
import { eventCreator } from './event-creator';

export interface createSendQueueOptions {
	randomFilenames?: boolean;
	destination?: string;
}

export const createSendQueue = async (post: Post, options?: createSendQueueOptions): Promise<TelegramSendEvent[]> => {
	const destination = options?.destination ?? os.tmpdir();
	const randomFilenames = options?.randomFilenames ?? false;
	let eventQueue = [] as TelegramSendEvent[];
	if (!post) return eventQueue;
	if (post.attachments) {
		// Если имеются прикрепленные файлы, то обрабатываем их и получаем информацию о них
		const mediaFiles = await getMediaFilesFromAttachments(post.attachments, { destination, randomFilenames });
		// Если файлы обработались, то продолжаем работать с событиями
		if (mediaFiles.length) {
			if (mediaFiles.length === 1) {
				const mediaFile = mediaFiles[0];
				let eventsToAdd = [] as TelegramSendEvent[];
				if (mediaFile.type === 'photo') {
					eventsToAdd = eventCreator('sendPhoto', post, mediaFiles);
				} else if (mediaFile.type === 'video') {
					eventsToAdd = eventCreator('sendVideo', post, mediaFiles);
				} else if (mediaFile.type === 'document') {
					eventsToAdd = eventCreator('sendDocument', post, mediaFiles);
				}
				// TODO: добавить sendAudio, sendAnimation(для GIF)
				eventQueue = [...eventQueue, ...eventsToAdd];
			} else {
				// Если есть документы, то отправляем отдельно
				const documents = mediaFiles.filter((m) => m.type === 'document');
				if (documents.length) {
					if (documents.length === 1) {
						// Если один документ, то отправляем через sendDocument
						eventQueue = [...eventQueue, ...eventCreator('sendDocument', post, documents)];
					} else if (documents.length >= 2) {
						// Если больше 2х, то отправляем через sendMediaGroup
						eventQueue = [...eventQueue, ...eventCreator('sendMediaGroup', post, documents)];
					}
				}

				// TODO: Если есть аудио, то отправляем отдельно
				// TODO: Если есть GIF, то отправляем отдельно

				// Если есть фото или видео, то отправляем отдельно
				const photosAndVideos = mediaFiles.filter((m) => m.type === 'video' || m.type === 'photo') as (VideoInfo | ImageInfo)[];
				if (photosAndVideos.length) {
					if (photosAndVideos.length === 1) {
						if (photosAndVideos[0].type === 'video') {
							eventQueue = [...eventQueue, ...eventCreator('sendVideo', post, photosAndVideos)];
						} else if (photosAndVideos[0].type === 'photo') {
							eventQueue = [...eventQueue, ...eventCreator('sendPhoto', post, photosAndVideos)];
						}
					} else if (photosAndVideos.length >= 2) {
						eventQueue = [...eventQueue, ...eventCreator('sendMediaGroup', post, photosAndVideos)];
					}
				}
			}
		}
	} else {
		// Или если есть текст, то добавляем в очередь событие sendMessage
		if (post.text) {
			eventQueue = [...eventQueue, ...eventCreator('sendMessage', post)];
		}
	}

	// Сделать первое сообщение с оповещением(остальные без оповещения)
	eventQueue[0].payload.options.disable_notification = false;
	return eventQueue;
};
