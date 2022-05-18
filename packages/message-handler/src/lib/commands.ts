import { Message } from '@yc-bot/types';
import { vk } from '@yc-bot/vk-api';
import fetch from 'node-fetch';

export const test = async (message: Message): Promise<void> => {
	const { peer_id } = message.message;
	await vk.sendMessage(peer_id, 'test');
};

export const stocks = async (message: Message): Promise<void> => {
	const currencyToken = process.env.CURRENCY_TOKEN;
	if (!currencyToken) return;
	const { peer_id } = message.message;
	const symbols = ['USD/RUB', 'EUR/RUB', 'BTC/USD', 'ETH/USD'];
	let currenciesAll = null;
	let currencies = [];
	try {
		const response = await fetch('https://api-adapter.backend.currency.com/api/v2/ticker/24hr', { headers: { 'X-MBX-APIKEY': currencyToken } });
		currenciesAll = await response.json();
	} catch (err) {
		console.log(JSON.stringify(err));
		return;
	}
	currencies = currenciesAll.filter((currency) => symbols.includes(currency.symbol));

	console.log(JSON.stringify(currencies));
	const textArray = currencies.map((currency) => {
		return `${currency.symbol}: ${currency.lastPrice}`;
	});
	const text = textArray.join('\n');
	await vk.sendMessage(peer_id, text);
};
