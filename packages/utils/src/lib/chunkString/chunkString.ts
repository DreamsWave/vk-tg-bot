import chunk from 'chunk-text'

export const chunkString = (str: string, size: number, firstElementSize?: number): string[] => {
    str = str.trim();
    if (firstElementSize) {
        const firstElementSizeChunks = chunk(str, firstElementSize);
        const restChunks = chunk(firstElementSizeChunks.slice(1).join(" "), size);
        return [firstElementSizeChunks[0], ...restChunks];
    }
    return chunk(str, size);
}