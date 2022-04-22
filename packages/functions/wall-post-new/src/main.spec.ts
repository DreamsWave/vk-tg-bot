import { handler } from './main';
import { ymq } from '@yc-bot/mocks'
import { Messages, Context } from '@yc-bot/types'

describe('Wall Post New Function', () => {
    it('Should return "ok"', async () => {
        const messages: Messages = ymq.messages
        const context: Context = {}
        const result = await handler(messages, context)
        expect(result.body).toEqual('ok');
    });
});
