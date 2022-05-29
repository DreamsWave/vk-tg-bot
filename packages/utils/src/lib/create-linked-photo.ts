import { getShortLink } from '@yc-bot/api/vk';

const createLinkedPhoto = async (url: string): Promise<string> => {
	try {
		const shortenUrl = await getShortLink(url);
		if (shortenUrl) {
			return `<a href="${shortenUrl}">­</a>`;
		}
	} catch (error) {
		console.error(error);
	}
	return `<a href="${url}">­</a>`;
};
export default createLinkedPhoto;
