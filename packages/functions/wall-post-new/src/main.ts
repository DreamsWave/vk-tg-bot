import { Messages, Context, VKEvent } from '@yc-bot/types'
import { logger } from '@yc-bot/utils'
import { IWallAttachmentPayload } from 'vk-io'
import { prepareAttachments } from '@yc-bot/utils'

export const handler = async (messages: Messages, context: Context) => {
    logger.info('wall-post-new')
    logger.info(messages)
    logger.info(context)
    for (const message of messages.messages) {
        const event: VKEvent = JSON.parse(message.details.message.body) ?? ""
        // const post = new WallAttachment({ api: null, payload: body.object })
        // if (post.hasAds) continue
        // if (post.postType !== 'post') continue
        // if (post.hasAttachments) {
        //     const attachmentsToSend = await download.attachments.downloadAttachments(post)
        // }
        const post = event.object as IWallAttachmentPayload
        if (post.attachments) {
            const attachments = await prepareAttachments(post.attachments)
            logger.warn('test')
            if (attachments) {
                // await sendPost(post, attachments)
            }
        }
        // await sendPost(post)
    }
    return {
        statusCode: 200,
        body: "ok"
    }
}
