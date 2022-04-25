import { photo, video, doc } from '../attachments'

export type PhotoTypes = keyof typeof photo
export type VideoTypes = keyof typeof video
export type DocTypes = keyof typeof doc

export const getPhoto = (type: PhotoTypes) => {
    return photo[type]
}
export const getVideo = (type: VideoTypes) => {
    return video[type]
}
export const getDoc = (type: DocTypes) => {
    return doc[type]
}