export const calculateImageDimensions = (width: number, height: number, maxWidth: number, maxHeight: number): { width: number; height: number } => {
	if (width > height) {
		if (width > maxWidth) {
			height = Math.round((height *= maxWidth / width));
			width = maxWidth;
		}
	} else {
		if (height > maxHeight) {
			width = Math.round((width *= maxHeight / height));
			height = maxHeight;
		}
	}
	return { width, height };
};
