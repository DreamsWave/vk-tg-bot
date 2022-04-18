import { VK, YC } from '@yc-bot/types';
import { YMQ } from '@yc-bot/yc-api'

export const handler = async (event: YC.Event, context: YC.Context) => {
    // console.log(JSON.stringify(event))
    // console.log(JSON.stringify(context))
    const body = JSON.parse(event.body) ?? {}

    if (body?.type === 'wall_post_new') {
        console.log("wall_post_new");
        console.log(JSON.stringify(body))
        const data: VK.IWallPostNew = body
        const ymqUrl = process.env.NX_YMQ_WALL_POST_NEW_URL
        const ymq = new YMQ(ymqUrl);
        await ymq.sendMessage(data);
    }

    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'text/plain',
        },
        body: 'ok'
    }
};

