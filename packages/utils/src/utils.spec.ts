import { text } from '@yc-bot/mocks' // 5000 characters
import { chunkString } from '.'
describe('Utils', () => {
    describe('chunkString', () => {
        it('Should return array of chunked strings', async () => {
            const stringArray = chunkString(text, 1024)
            expect(Array.isArray(stringArray)).toBe(true)
            expect(typeof stringArray[0]).toBe('string')
        });
        it('Should chunk(2048) string(5000) to [2042, 2048, 908]', async () => {
            const stringArray = chunkString(text, 2048)
            const lengthArray = stringArray.map(str => str.length)
            expect(lengthArray).toEqual([2042, 2048, 908])
        });
        it('Should chunk first element(1024) and rest elements(2048) string(5000) to [1021, 2047, 1930]', async () => {
            const stringArray = chunkString(text, 2048, 1024)
            const lengthArray = stringArray.map(str => str.length)
            expect(lengthArray).toEqual([1021, 2047, 1930])
        });
        it('Should chunk(500) string(1000) to [493, 497, 8]', async () => {
            const stringArray = chunkString(text.substr(0, 1000), 500)
            const lengthArray = stringArray.map(str => str.length)
            expect(lengthArray).toEqual([493, 497, 8])
        });
        it('Should chunk first element(100) and rest elements(500) string(1000) to [98, 497, 403]', async () => {
            const stringArray = chunkString(text.substr(0, 1000), 500, 100)
            const lengthArray = stringArray.map(str => str.length)
            expect(lengthArray).toEqual([98, 497, 403])
        });
    });
});
