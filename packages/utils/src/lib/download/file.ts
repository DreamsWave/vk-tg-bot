import https from "https";
import fs from "fs"
import { logger } from "../logger";
import { FileInfo } from "@yc-bot/types";
import path from "path";
import { extension } from "mime-types";

export default async function downloadFile(fileUrl: string, downloadTo: string, filename: string): Promise<FileInfo> {
    return new Promise((resolve, reject) => {
        const request = https.get(fileUrl, async resp => {
            if (resp.headers.location && resp.statusCode === 302) {
                resolve(await downloadFile(resp.headers.location, downloadTo, filename))
                return;
            }
            const size = Math.round(parseInt(resp.headers['content-length'], 10) / 1000) // kb
            const mime = resp.headers["content-type"]
            const ext = extension(mime)
            const filePath = path.join(downloadTo, `${filename}.${ext}`)

            if (size > 50000) reject("File is bigger than 50mb")

            const fileStream = fs.createWriteStream(filePath)
            resp.pipe(fileStream)

            const fileInfo: FileInfo = {
                mime,
                size,
                path: filePath,
                filename,
                ext
            }

            fileStream.on("finish", () => {
                fileStream.close();
                resolve(fileInfo)
            });
            request.on('error', err => {
                logger.error(err)
                reject(err)
            });
            fileStream.on('error', err => {
                logger.error(err)
                reject(err)
            });
            request.end();
        })
    })
}