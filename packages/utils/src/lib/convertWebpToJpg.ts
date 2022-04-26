import https from "https";
import { extension } from "mime-types";
import webp from "webp-converter"
import path from 'path'
import fs from "fs"
import os from "os"
import { logger } from "./logger";
import { FileInfo } from "@yc-bot/types";

export const convertWebpToJpg = async (filePath: string): Promise<FileInfo> => {
    const fullFilename = path.basename(filePath)
    const fileExt = path.extname(fullFilename)
    const name = path.basename(filePath, fileExt)
    if (!isWebp(filePath)) {
        logger.warn(`convertWebpToJpg expected webp image but got: ${fileExt}`)
        return
    }
    const newfilePath = path.join(path.dirname(filePath), `${name}.jpg`);
    await webp.dwebp(filePath, newfilePath, "-o");
    fs.unlink(filePath, err => { if (err) logger.error(err) })
    const size = Math.round(fs.statSync(newfilePath).size / 1000) // kb
    if (size > 50000) throw "File is bigger than 50mb"
    const [filename, ext] = path.basename(newfilePath).split('.')
    const fileInfo: FileInfo = {
        ext,
        filename,
        mime: "image/jpeg",
        path: newfilePath,
        size,
        buffer: fs.createReadStream(newfilePath)
    }

    return fileInfo
}

export const isWebp = (location: string): boolean => {
    return path.extname(path.basename(location)) === '.webp'
}