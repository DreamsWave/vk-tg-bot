import { Messages, Context, VKEvent, Post } from '@yc-bot/types'
import { prepareAttachments, logger } from '@yc-bot/utils'

export const handler = async (messages: Messages, context: Context) => {
    logger.info('wall-post-new')
    logger.info(messages)
    logger.info(context)
    for (const message of messages.messages) {
        const event: VKEvent = JSON.parse(message.details.message.body) ?? ""
        const post = event.object as Post
        if (post.marked_as_ads) continue
        if (post.post_type !== 'post') continue
        if (post.attachments) {
            const attachments = await prepareAttachments(post.attachments)
            if (attachments) {
                // await sendPost(post, attachments)
                continue
            }
        }
        // await sendPost(post)
    }
    return {
        statusCode: 200,
        body: "ok"
    }
}
