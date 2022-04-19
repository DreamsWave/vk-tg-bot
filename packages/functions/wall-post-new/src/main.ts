import { YC } from '@yc-bot/types'
import { logger } from '@yc-bot/utils'


export const handler = async (messages: YC.Messages, context: YC.Context) => {
    logger.info('wall-post-new')
    logger.debug(messages)
    logger.debug(context)
    return {
        statusCode: 200,
        body: "ok"
    }
}
