import { SQS } from 'aws-sdk';
import { ymq } from './yc';

describe('Yandex Cloud API tests', () => {
    describe('Yandex Message Queue', () => {
        beforeAll(() => {
            jest.spyOn(ymq, 'sendMessage').mockImplementation(() => Promise.resolve({} as SQS.SendMessageResult))
        })
        it('Should work', async () => {
            const url = "https://some-url.com"
            const message = { some: "data" }
            let result;
            try {
                result = await ymq.sendMessage(url, message)
                expect(result).toBeDefined();
            } catch (error) {
                expect(error).toBe(/url is required/i);
            }
        });
    });
});
