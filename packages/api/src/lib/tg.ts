import TelegramBot, { InputMedia, SendMessageOptions } from "node-telegram-bot-api"
import { chunkString, logger } from '@yc-bot/utils'
import { Post, PAttachments } from '@yc-bot/types'

export interface ITG {
    chatId: number,
    api: TelegramBot,
    sendPost: (post: unknown, attachments?: unknown) => Promise<void>
    sendLongMessage: (text: string, options?: SendMessageOptions) => Promise<void>
}

export default class TG implements ITG {
    public chatId: number
    public api: TelegramBot

    constructor(token: string, chatId?: number, options?: object) {
        this.chatId = -chatId || -process.env.NX_TG_CHAT_ID
        this.api = new TelegramBot(token, options)
    }

    async sendPost(post: Post, attachments?: PAttachments): Promise<void> {
        const { photos, videos, docs } = attachments
        if (photos || videos || docs) {
            const allAttachments = [...photos, ...videos, ...docs]
            if (allAttachments.length >= 2 && allAttachments.length <= 10) {
                const mediaGroup = allAttachments.map(media => ({ type: media.type, media: media.buffer })) as InputMedia[]
                try {
                    const response = await this.api.sendMediaGroup(this.chatId, mediaGroup);
                } catch (error) {
                    logger.error(error)
                }
            }
        }
        await this.sendLongMessage(post.text)
    }

    async sendLongMessage(text: string, options?: SendMessageOptions): Promise<void> {
        const chunkedText = chunkString(text, 4096)
        for (const text of chunkedText) {
            const response = await this.api.sendMessage(this.chatId, text, options)
        }
    }
}
