import { TG } from "@yc-bot/api"
import { PAttachment, Post } from "@yc-bot/types"

export const sendPost = async (post: Post, attachments?: PAttachment[]): Promise<void> => {
    const tgToken = process.env.NX_TG_TOKEN
    const tg = new TG(tgToken)
    return Promise.resolve()
}