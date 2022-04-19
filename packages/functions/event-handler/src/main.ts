import { YC } from '@yc-bot/types';
import { logger } from '@yc-bot/utils';
import { YMQ } from '@yc-bot/yc-api'

export const handler = async (event: YC.Event, context: YC.Context) => {
    logger.info("event-handler")
    logger.debug(event)
    logger.debug(context)
    const body = JSON.parse(event.body) ?? {}

    if (body?.type === 'wall_post_new') {
        logger.debug("wall_post_new")
        if (process.env.NODE_ENV !== "development") {
            const ymqUrl = process.env.NX_YMQ_WALL_POST_NEW_URL
            const ymq = new YMQ(ymqUrl);
            await ymq.sendMessage(body);
        }
    }

    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'text/plain',
        },
        body: 'ok'
    }
};

