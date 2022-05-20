import pathToFfmpeg from 'ffmpeg-static';
import path from 'path';
import child_process from 'child_process';
import { promisify } from 'util';
promisify(child_process.exec);
const exec = child_process.exec;

export const convertVideoToMP4 = async (fileLocation: string): Promise<string> => {
	return new Promise((resolve, reject) => {
		const convertedFileLocation = path.join(path.dirname(fileLocation), `c-${path.basename(fileLocation).split('.')[0]}.mp4`);
		exec(`"${pathToFfmpeg}" -i ${fileLocation} -codec:v libx264 -preset veryfast ${convertedFileLocation}`, (err) => {
			if (err) reject(err);
			resolve(convertedFileLocation);
		});
	});
};
