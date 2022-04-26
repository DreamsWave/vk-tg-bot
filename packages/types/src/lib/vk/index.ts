import { IWallAttachmentPayload } from "vk-io";

export * from "./attachments"

export interface VKEvent {
    group_id?: number;
    type?: string;
    event_id?: string;
    v?: string;
    object?: object;
    secret?: string;
}

export type Post = IWallAttachmentPayload