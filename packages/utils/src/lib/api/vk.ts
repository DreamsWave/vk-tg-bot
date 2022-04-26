import { VK as VKAPI } from 'vk-io'

export default class VK extends VKAPI {
    constructor(token: string, options?: object) {
        super({ ...options, token })
    }
}