import { handler } from './main';
import { vkEvents, http } from '@yc-bot/mocks'
import { VK, YC } from '@yc-bot/types'

describe('Event Handler Function', () => {
    it('should return "ok"', async () => {
        const event = {} as YC.Event
        event["body"] = JSON.stringify(vkEvents.wallPostNew)
        expect((await handler(event, {})).body).toEqual('ok');
    });
});
