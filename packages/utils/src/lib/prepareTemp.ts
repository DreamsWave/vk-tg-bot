import fs from 'fs';
import os from 'os';
import { logger } from './logger';

export default function prepareTemp(location: string = os.tmpdir()): void {
	fs.mkdir(location, { recursive: true }, (err) => {
		if (err) {
			logger.error(err);
			throw err;
		}
		fs.readdir(location, (err, files) => {
			if (err) throw err;
			for (const file of files) {
				fs.unlink(`${location}/${file}`, (err) => {
					if (err) throw err;
				});
			}
		});
	});
}
