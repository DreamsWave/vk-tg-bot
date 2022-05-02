import { Message } from '@yc-bot/types';
import * as commands from './commands';

export async function messageHandler(message: Message): Promise<void> {
	const { text } = message.message;

	if (/test/i.test(text)) {
		commands.test(message);
	}

	if (/stocks/i.test(text)) {
		commands.stocks(message);
	}
}
