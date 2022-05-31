import { makeID } from '@yc-bot/utils';
import isPostUnique from '../lib/is-post-unique';

describe('isPostUnique', () => {
	let postId = null;
	beforeAll(() => {
		postId = makeID();
	});
	it('should set vk_last_post_id in db and return true', async () => {
		try {
			expect(await isPostUnique(postId)).toBe(true);
		} catch (error) {
			expect(true).toBe(false);
		}
	});
	it('should return false if post is duplicate', async () => {
		try {
			expect(await isPostUnique(1)).toBe(false);
		} catch (error) {
			expect(true).toBe(false);
		}
	});
});
