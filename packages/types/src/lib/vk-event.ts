export interface VKEvent {
    group_id?: number;
    type?: string;
    event_id?: string;
    v?: string;
    object?: object;
    secret?: string;
}