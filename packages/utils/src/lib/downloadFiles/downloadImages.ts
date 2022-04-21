import https from "https";
import { extension } from "mime-types";
import webp from "webp-converter"
import path from 'path'
import fs from "fs"
import os from "os"
import { logger } from "../logger";

export function downloadImage(imageUrl: string, filename: number | string, location: string = os.tmpdir()): Promise<string> {
    return new Promise((resolve, reject) => {
        https.get(imageUrl, async resp => {
            const contentType = resp.headers["content-type"];
            const ext: string = extension(contentType);
            const imagePath = path.join(location, `${filename}.${ext}`);
            const fileStream = fs.createWriteStream(imagePath)
            await Promise.resolve(resp.pipe(fileStream))
            resolve(imagePath)
        })
    })
}

export function isWebp(location) {
    return path.extname(path.basename(location)) === '.webp'
}

export async function convertWebpToJpg(location: string): Promise<string> {
    const filename = path.basename(location)
    const fileExt = path.extname(filename)
    const name = path.basename(location, fileExt)
    if (!isWebp(location)) {
        logger.warn(`convertWebpToJpg expected webp image but got: ${fileExt}`)
        return location
    }
    const newLocation = path.join(path.dirname(location), `${name}.jpg`);
    await webp.dwebp(location, newLocation, "-o");
    fs.unlink(location, err => { if (err) logger.error(err) })
    return newLocation
}