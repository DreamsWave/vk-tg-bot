import https from "https";
import fs from "fs"
import youtubeDlExec from "youtube-dl-exec";
import { FileInfo } from "@yc-bot/types";
import path from "path";
import { extension } from "mime-types";
import { logger } from "./logger";

export const downloadFile = async (fileUrl: string, downloadTo: string, filename: string): Promise<FileInfo> => {
    return new Promise((resolve, reject) => {
        const request = https.get(fileUrl, async resp => {
            if (resp.headers.location && resp.statusCode === 302) {
                resolve(await downloadFile(resp.headers.location, downloadTo, filename))
                return;
            }
            const size = Math.ceil(parseInt(resp.headers['content-length'], 10) / 1000) // kb
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

export const downloadVideo = async (videoUrl: string, filePath: string): Promise<FileInfo> => {
    const result = await youtubeDlExec(videoUrl, { dumpJson: true, format: "best[height<=720]" })
    if (result.duration > 120) return null
    if (result.extractor === 'youtube') return null
    await youtubeDlExec(videoUrl, { output: filePath, format: "best[height<=720]" })
    const videoPath = filePath.replace(/%\(ext\)s/i, result.ext)
    const size = Math.round(fs.statSync(videoPath).size / 1000) // kb
    if (size > 50000) throw "File is bigger than 50mb"
    const [filename, ext] = path.basename(videoPath).split('.')
    const fileInfo: FileInfo = {
        ext,
        filename,
        mime: "",
        path: videoPath,
        size
    }
    return fileInfo
}