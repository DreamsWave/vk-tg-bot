import https from "https";
import http from 'http'
import { extension } from "mime-types";
import path from 'path'
import fs from "fs"
import os from "os"
import { DownloadDocumentOptions } from '@yc-bot/types'
import { logger } from "../logger";

export interface FileInfo {
    mime: string,
    size: number,
    path: string
}

export const downloadDocument = async (docUrl: string, filePath: string): Promise<FileInfo> => {
    return new Promise((resolve, reject) => {
        const request = https.get(docUrl, async resp => {
            if (resp.headers.location && resp.statusCode === 302) resolve(downloadDocument(resp.headers.location, filePath))
            const fileStream = fs.createWriteStream(filePath)
            await Promise.resolve(resp.pipe(fileStream))
            const fileInfo: FileInfo = {
                mime: resp.headers['content-type'],
                size: parseInt(resp.headers['content-length'], 10),
                path: filePath
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
// export const downloadDocument = async (docUrl: string, { filename, location = os.tmpdir(), ext }: DownloadDocumentOptions): Promise<{ mime: string, size: number, path: string }> => {
//     return new Promise((resolve, reject) => {
//         https.get(docUrl, async resp => {
//             if (resp.headers.location) resolve(downloadDocument(resp.headers.location, { filename, location, ext }))
//             const docPath = path.join(location, `${filename}.${ext}`);
//             const fileStream = fs.createWriteStream(docPath)
//             await Promise.resolve(resp.pipe(fileStream))
//             const fileInfo = {
//                 mime: resp.headers['content-type'],
//                 size: parseInt(resp.headers['content-length'], 10),
//                 path: docPath
//             }
//             resolve(fileInfo)
//         })
//     })
// }

// export const downloadDocument = async (url, filePath) => {
//     const proto = !url.charAt(4).localeCompare('s') ? https : http;

//     return new Promise((resolve, reject) => {
//         const file = fs.createWriteStream(filePath);
//         let fileInfo = null;

//         const request = proto.get(url, response => {
//             if (response.headers.location) resolve(downloadDocument(url, filePath))
//             if (response.statusCode !== 200) {
//                 fs.unlink(filePath, () => {
//                     reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
//                 });
//                 return;
//             }

//             fileInfo = {
//                 mime: response.headers['content-type'],
//                 size: parseInt(response.headers['content-length'], 10),
//             };

//             resolve(response.pipe(file));
//         });

//         // The destination stream is ended by the time it's called
//         file.on('finish', () => resolve(fileInfo));

//         request.on('error', err => {
//             fs.unlink(filePath, () => reject(err));
//         });

//         file.on('error', err => {
//             fs.unlink(filePath, () => reject(err));
//         });

//         request.end();
//     });
// }
