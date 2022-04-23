import path from 'path'
import os from "os"
import fs from "fs"
import youtubeDlExec from "youtube-dl-exec";
import { FileInfo } from '@yc-bot/types'
import { logger } from '../logger';

export const downloadVideo = async (videoUrl: string, filePath: string): Promise<FileInfo> => {
    await youtubeDlExec(videoUrl, { output: filePath })
    const size = Math.round(fs.statSync(filePath).size / 1000) // kb
    if (size > 50000) throw "File is bigger than 50mb"
    const [filename, ext] = path.basename(filePath).split('.')
    const fileInfo: FileInfo = {
        ext,
        filename,
        mime: "",
        path: filePath,
        size
    }
    return fileInfo
}