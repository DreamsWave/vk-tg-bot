import path from 'path'
import os from "os"
import youtubeDlExec from "youtube-dl-exec";

export const downloadVideo = async (videoUrl: string, filename: number | string, location: string = os.tmpdir()): Promise<string> => {
    const outputLocation = path.join(location, `${filename}.mp4`)
    await Promise.resolve(await youtubeDlExec(videoUrl, { output: outputLocation }))
    return outputLocation
}
