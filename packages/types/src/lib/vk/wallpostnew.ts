export interface IWallPostNew {
    group_id: number;
    type: string;
    event_id: string;
    v: string;
    object: IObject;
    secret: string;
}

export interface IObject {
    id: number;
    from_id: number;
    owner_id: number;
    date: number;
    marked_as_ads: number;
    can_delete: number;
    is_favorite: boolean;
    post_type: string;
    text: string;
    can_edit: number;
    created_by: number;
    attachments?: IAttachment[];
    comments: IComments;
    donut: IDonut;
    short_text_rate: number;
    hash: string;
}

export interface IAttachment {
    type: string;
    photo: IPhoto;
}

export interface IPhoto {
    album_id: number;
    date: number;
    id: number;
    owner_id: number;
    access_key: string;
    post_id: number;
    sizes: ISize[];
    text: string;
    user_id: number;
    has_tags: boolean;
}

export interface ISize {
    height: number;
    url: string;
    type: string;
    width: number;
}

export interface IComments {
    count: number;
}

export interface IDonut {
    is_donut: boolean;
}
