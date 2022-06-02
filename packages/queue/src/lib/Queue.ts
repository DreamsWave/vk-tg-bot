import { Files, FileType, ImageInfo, TelegramSendEvent, VideoInfo } from '@yc-bot/types';
import { chunkString, createLinkedPhoto } from '@yc-bot/utils';
import { MAX_CAPTION_TEXT_LENGTH, MAX_MESSAGE_TEXT_LENGTH } from './constants';
import createEvent from './create-event';

export interface IQueue {
	addFiles(mediaFiles: Files): TelegramSendEvent[];
	addText(text: string): Promise<TelegramSendEvent[]>;
	addNotification(options: { onlyFirst: boolean; all: boolean }): TelegramSendEvent[];
	getQueue(): TelegramSendEvent[];
	clearQueue(): TelegramSendEvent[];
}

class Queue implements IQueue {
	private _queue: TelegramSendEvent[] = [];

	private addEventInQueue(event: TelegramSendEvent) {
		this._queue = [...this._queue, event];
	}

	private addFile(file: FileType): TelegramSendEvent[] {
		const media = file;
		if (media.type === 'photo') {
			this.addEventInQueue(createEvent({ method: 'sendPhoto', media }));
		} else if (media.type === 'video') {
			this.addEventInQueue(createEvent({ method: 'sendVideo', media }));
		} else if (media.type === 'document') {
			if (media.ext === 'gif') {
				this.addEventInQueue(createEvent({ method: 'sendAnimation', media }));
			} else {
				this.addEventInQueue(createEvent({ method: 'sendDocument', media }));
			}
		} else if (media.type === 'audio') {
			this.addEventInQueue(createEvent({ method: 'sendAudio', media }));
		}

		return this._queue;
	}

	public addFiles(files: Files): TelegramSendEvent[] {
		if (!files.length) return this._queue;
		if (files.length === 1) {
			this.addFile(files[0]);
		} else {
			const documents = files.filter((m) => m.type === 'document');
			if (documents.length) {
				for (const doc of documents) {
					this.addFile(doc);
				}
			}
			const audio = files.filter((m) => m.type === 'audio');
			if (audio.length) {
				for (const audioFile of audio) {
					this.addFile(audioFile);
				}
			}
			const photosAndVideos = files.filter((m) => m.type === 'video' || m.type === 'photo') as (VideoInfo | ImageInfo)[];
			if (photosAndVideos.length) {
				if (photosAndVideos.length === 1) {
					this.addFile(photosAndVideos[0]);
				} else if (photosAndVideos.length >= 2) {
					const media = photosAndVideos.splice(0, 10);
					this.addEventInQueue(createEvent({ method: 'sendMediaGroup', media }));
				}
			}
		}
		return this._queue;
	}
	public async addText(text: string): Promise<TelegramSendEvent[]> {
		if (!text) return this._queue;
		const lastItemIndex = this._queue.length - 1;
		const lastItem = this._queue[lastItemIndex];
		if (this._queue.length && lastItem.method !== 'sendMessage') {
			// if last event in queue sendPhoto and text length greater than 0 and less of equal max text message length - 50
			// modify that event to sendMessage and add photo as link
			if (lastItem.method === 'sendPhoto' && text.length > MAX_CAPTION_TEXT_LENGTH && text.length <= MAX_MESSAGE_TEXT_LENGTH - 50) {
				const linkedPhoto = await createLinkedPhoto(lastItem.payload.origin);
				this._queue[lastItemIndex] = await createEvent({ method: 'sendMessage', text: text + ' ' + linkedPhoto });
			} else {
				const [textFirstChunk, ...textRestChunks] = chunkString(text, MAX_MESSAGE_TEXT_LENGTH, MAX_CAPTION_TEXT_LENGTH);
				this._queue[lastItemIndex].payload.options.caption = textFirstChunk;
				for (const textChunk of textRestChunks) {
					this.addEventInQueue(createEvent({ method: 'sendMessage', text: textChunk }));
				}
			}
			return this._queue;
		}
		const textChunks = chunkString(text, MAX_MESSAGE_TEXT_LENGTH);
		for (const textChunk of textChunks) {
			this.addEventInQueue(createEvent({ method: 'sendMessage', text: textChunk }));
		}
		return this._queue;
	}
	public addNotification(options?: { onlyFirst?: boolean; all?: boolean }): TelegramSendEvent[] {
		const { onlyFirst = true, all = false } = options ?? {};
		if (onlyFirst) {
			this._queue[0].payload.options.disable_notification = false;
		}
		if (all) {
			for (let i = 0; i < this._queue.length; i++) {
				this._queue[i].payload.options.disable_notification = false;
			}
		}
		return this._queue;
	}
	public getQueue(): TelegramSendEvent[] {
		return this._queue;
	}
	public clearQueue(): TelegramSendEvent[] {
		this._queue = [];
		return this._queue;
	}
}

export default Queue;
