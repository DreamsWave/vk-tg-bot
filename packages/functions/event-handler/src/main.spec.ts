import { handler } from './main';
import { vkEvents } from '@yc-bot/mocks'
import { YC } from '@yc-bot/types'
import * as api from '@yc-bot/api'
import { SQS } from "aws-sdk";

describe('Event Handler Function', () => {
    beforeAll(() => {
        jest.spyOn(api.yc.ymq, 'sendMessage').mockImplementation(() => Promise.resolve({} as SQS.SendMessageResult))
    })
    it('should return "ok"', async () => {
        const event = {} as YC.Event
        event["body"] = JSON.stringify(vkEvents.wallPostNew.simple)
        const result = await handler(event, {})
        expect(result.body).toEqual('ok');
    });
});
