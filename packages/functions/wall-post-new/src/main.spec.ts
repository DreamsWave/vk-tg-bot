import { handler } from './main';
import {
    // vkEvents, 
    // http, 
    ycEvents
} from '@yc-bot/mocks'
import { YC } from '@yc-bot/types'

describe('Wall Post New Function', () => {
    it('Should return "ok"', async () => {
        const messages: YC.Messages = ycEvents.messages
        const context: YC.Context = {}
        const result = await handler(messages, context)
        expect(result.body).toEqual('ok');
        // expect('ok').toEqual('ok');
    });
});
