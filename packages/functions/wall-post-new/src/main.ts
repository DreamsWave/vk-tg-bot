import { YC } from '@yc-bot/types'
import { logger } from '@yc-bot/utils'
import { WallAttachment } from 'vk-io'

export const handler = async (messages: YC.Messages, context: YC.Context) => {
    logger.info('wall-post-new')
    logger.debug(messages)
    logger.debug(context)
    for (const message of messages.messages) {
        const body = JSON.parse(message.details.message.body) ?? ""
        const post = new WallAttachment({ api: null, payload: body.object })
        if (post.hasAds) continue
        if (post.postType !== 'post') continue
    }
    return {
        statusCode: 200,
        body: "ok"
    }
}
