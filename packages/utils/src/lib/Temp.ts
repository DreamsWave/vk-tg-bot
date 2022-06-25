import os from 'os';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

export default class Temp {
	private static tmpdir = os.tmpdir();
	private static location: string;

	public static prepare(tmpdir?: string): string {
		const tempdir = tmpdir ?? Temp.tmpdir ?? os.tmpdir();
		Temp.location = fs.mkdtempSync(path.join(tempdir, 'bot-'));
		return Temp.location;
	}
	public static setTmpdir(tmpdir: string): string {
		if (!fs.existsSync(tmpdir)) {
			fs.mkdirSync(tmpdir);
		}
		process.env['TEMP'] = tmpdir;
		process.env['TMP'] = tmpdir;
		process.env['TMPDIR'] = tmpdir;
		Temp.tmpdir = tmpdir;
		return Temp.tmpdir;
	}
	public static getLocation(): string {
		return Temp.location;
	}
	public static removeLocation(): void {
		if (Temp.location) {
			try {
				fs.rmSync(Temp.location, { recursive: true, force: true });
			} catch (error) {
				console.log(error);
			}
		}
	}
	public static cleanTmpdir(): void {
		if (Temp.tmpdir) {
			fs.readdir(Temp.tmpdir, (err, files) => {
				if (err) throw err;
				for (const file of files) {
					fs.rmdir(`${Temp.tmpdir}/${file}`, (err) => {
						if (err) throw err;
					});
				}
			});
		}
	}
}
