import { YC } from '@yc-bot/types'

export const handler = async (event: YC.Event, context: YC.Context) => {
    console.log('wall-post-new')
    console.log(JSON.stringify(event))
    console.log(JSON.stringify(context))
    return {
        statusCode: 200,
        body: "ok"
    }
}
