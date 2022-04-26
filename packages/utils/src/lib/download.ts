import https from "https";
import fs from "fs"
import youtubeDlExec from "youtube-dl-exec";
import { FileInfo } from "@yc-bot/types";
import path from "path";
import { extension } from "mime-types";
import ytdl from 'ytdl-core'
import { logger } from "./logger";

export const downloadFile = async (fileUrl: string, saveTo: string, filename: string | number): Promise<FileInfo> => {
    return new Promise((resolve, reject) => {
        const request = https.get(fileUrl, async resp => {
            if (resp.headers.location && resp.statusCode === 302) {
                resolve(await downloadFile(resp.headers.location, saveTo, String(filename)))
                return;
            }
            const size = Math.ceil(parseInt(resp.headers['content-length'], 10) / 1000) // kb
            const mime = resp.headers["content-type"]
            const ext = extension(mime)
            const filePath = path.join(saveTo, `${filename}.${ext}`)

            if (size > 50000) reject("File is bigger than 50mb")

            const fileStream = fs.createWriteStream(filePath)
            resp.pipe(fileStream)

            const fileInfo: FileInfo = {
                mime,
                size,
                path: filePath,
                filename,
                ext,
                buffer: fs.createReadStream(filePath)
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

export const downloadVideo = async (videoUrl: string, saveTo: string, filename: string | number): Promise<FileInfo> => {
    const filePath = path.join(saveTo, `${filename}.%(ext)s`)
    const result = await youtubeDlExec(videoUrl, { dumpJson: true, format: "best[height<=360]" })
    if (result.duration > 600) return null
    if (result.extractor === 'youtube') {
        await downloadYoutubeVideo(result.webpage_url, saveTo, filename)
    } else {
        await youtubeDlExec(videoUrl, { output: filePath, format: "best[height<=360]" })
    }
    const videoPath = filePath.replace(/%\(ext\)s/i, result.ext)
    const size = Math.round(fs.statSync(videoPath).size / 1024) // kb
    if (size > 50000) throw "File is bigger than 50mb"
    const [name, ext] = path.basename(videoPath).split('.')
    const fileInfo: FileInfo = {
        ext,
        filename: name,
        mime: "",
        path: videoPath,
        size,
        buffer: fs.createReadStream(videoPath)
    }
    return fileInfo
}

export const downloadYoutubeVideo = (videoUrl: string, saveTo: string, filename: string | number): Promise<void> => {
    return new Promise((resolve, reject) => {
        const filePath = path.join(saveTo, `${filename}.mp4`)
        const fileStream = fs.createWriteStream(filePath)
        const video = ytdl(videoUrl);
        video.pipe(fileStream);
        video.on('end', () => {
            logger.info('Video downloaded');
            resolve()
        });
    })
}