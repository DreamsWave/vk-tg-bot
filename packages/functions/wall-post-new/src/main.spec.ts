import { handler } from './main';
import { vkEvents, http, ycEvents } from '@yc-bot/mocks'
import { YC } from '@yc-bot/types'

describe('wall-post-new Function', () => {
    it('should return "ok"', async () => {
        const messages = ycEvents.messages as YC.Messages
        const context = {} as YC.Context
        const result = await handler(messages, context)
        expect(result.body).toEqual('ok');
    });
});
