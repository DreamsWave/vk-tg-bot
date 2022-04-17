import * as postSimple from './http/post/post-simple.json'
import * as messageNew from './http/post/vk-events/message-new.json'
import * as wallPostNew from './http/post/vk-events/wall-post-new.json'

const http = {
    post: {
        postSimple
    }
}
const vkEvents = {
    messageNew,
    wallPostNew
}

export { vkEvents, http }