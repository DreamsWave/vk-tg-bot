process.env["NTBA_FIX_350"] = "1";
import TelegramBot, { InputMedia, SendMessageOptions } from "node-telegram-bot-api"
import { Post, PAttachments } from '@yc-bot/types'
import { chunkString } from '@yc-bot/utils'
import { MediaType } from "../prepareMedia";
import { logger } from "../logger";

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

    async sendPost(post: Post, media?: MediaType[], options?: SendMessageOptions): Promise<void> {
        try {
            if (media.length) {

                if (media.length === 1) {
                    const type = media[0].type
                    const m = media[0].media
                    switch (type) {
                        case "photo":
                            await this.api.sendPhoto(this.chatId, m, { ...options })
                            break
                        case "video":
                            await this.api.sendVideo(this.chatId, m, { ...options })
                            break
                        case "document":
                            await this.api.sendDocument(this.chatId, m, { ...options })
                            break
                    }
                }

                if (media.length >= 2 && media.length <= 10) {
                    const photosAndVideos = media.filter(m => m.type === 'photo' || m.type === 'video') as InputMedia[]
                    const documents = media.filter(m => m.type === 'document')
                    if (photosAndVideos.length) {
                        await this.api.sendMediaGroup(this.chatId, photosAndVideos, { ...options })
                    }
                    if (documents.length) {
                        for (const document of documents) {
                            await this.api.sendDocument(this.chatId, document.media, { ...options })
                        }
                    }
                }
            }

            await this.sendLongMessage(post.text, { ...options })

        } catch (error) {
            logger.error
        }
    }

    async sendLongMessage(text: string, options?: SendMessageOptions): Promise<void> {
        const chunkedText = chunkString(text, 4096)
        for (const text of chunkedText) {
            await this.api.sendMessage(this.chatId, text, { ...options })
        }
    }
}
