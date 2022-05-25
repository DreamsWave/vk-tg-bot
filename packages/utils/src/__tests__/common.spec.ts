import { chunkString, makeString } from '..';

describe('chunkString', () => {
	it('should chunk text(1000) to chunks with size less than 250', async () => {
		const stringSize = 1000;
		const chunkSize = 250;
		const text = makeString(stringSize);
		const chunks = chunkString(text, chunkSize);
		for (let i = 0; i < chunks.length; i++) {
			expect(chunks[i].length).toBeLessThanOrEqual(chunkSize);
		}
	});
	it('should chunk text(1000) to chunks with first chunk size 100 and rest chunks size less than or equal 250', async () => {
		const stringSize = 1000;
		const chunkSize = 250;
		const firstChunkSize = 100;
		const text = makeString(stringSize);
		const chunks = chunkString(text, chunkSize, firstChunkSize);
		for (let i = 0; i < chunks.length; i++) {
			if (i === 0) {
				expect(chunks[i].length).toBeLessThanOrEqual(firstChunkSize);
			} else {
				expect(chunks[i].length).toBeLessThanOrEqual(chunkSize);
			}
		}
	});
	it('should chunk 3 random text to chunks with first chunk size 1024 and rest chunks size less than or equal 4096', async () => {
		for (let j = 0; j < 3; j++) {
			const stringSize = Math.floor(Math.random() * 10000);
			const chunkSize = 4096;
			const firstChunkSize = 1024;
			const text = makeString(stringSize);
			const chunks = chunkString(text, chunkSize, firstChunkSize);
			for (let i = 0; i < chunks.length; i++) {
				if (i === 0) {
					expect(chunks[i].length).toBeLessThanOrEqual(firstChunkSize);
				} else {
					expect(chunks[i].length).toBeLessThanOrEqual(chunkSize);
				}
			}
		}
	});
});
