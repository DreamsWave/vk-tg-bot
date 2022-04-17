import { handler } from './main';
import { vkEvents, http } from '@yc-bot/mocks'

describe('Event Handler Function', () => {
    it('should return "ok"', async () => {
        expect(await (await handler(http.post.postSimple, {})).body).toEqual('ok');
    });
});
