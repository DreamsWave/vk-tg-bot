import { Photo, Video } from './attachments';

export * from './attachments';

export interface VKEvent {
	group_id?: number;
	type?: string;
	event_id?: string;
	v?: string;
	object?: object;
	secret?: string;
}

export interface Message {
	message: {
		date: number;
		from_id: number;
		id: number;
		peer_id: number;
		out?: number;
		attachments?: object[];
		conversation_message_id?: number;
		fwd_messages?: object[];
		important?: boolean;
		is_hidden?: boolean;
		random_id?: number;
		text?: string;
	};
	client_info?: {
		button_actions?: string[];
		keyboard?: boolean;
		inline_keyboard?: boolean;
		carousel?: boolean;
		lang_id?: number;
	};
}
export interface Attachment {
	type: string;
	photo?: Photo;
	video?: Video;
}
export interface Post {
	id: number;
	to_id?: number;
	owner_id: number;
	access_key?: string;
	from_id?: number;
	created_by?: number;
	date?: number;
	text?: string;
	reply_owner_id?: number;
	reply_post_id?: number;
	friends_only?: number;
	comments?: Partial<{
		count: number;
		can_post: number;
		groups_can_post: number;
		can_close: number;
		can_open: number;
	}>;
	copyright?: Partial<{
		id?: number;
		link: string;
		name: string;
		type: string;
	}>;
	likes?: Partial<{
		count: number;
		user_likes: number;
		can_like: number;
		can_publish: number;
	}>;
	reposts?: Partial<{
		count: number;
		user_reposted: number;
	}>;
	views?: Partial<{
		count: number;
	}>;
	post_type?: string;
	post_source?: Partial<{
		type: string;
		platform: string;
		data: string;
		url: string;
	}>;
	attachments?: Attachment[];
	geo?: object;
	signer_id?: number;
	copy_history?: Post[];
	can_pin?: number;
	can_delete?: number;
	can_edit?: number;
	is_pinned?: boolean;
	marked_as_ads?: number;
	is_favorite?: boolean;
	donut?: Partial<{
		is_donut: boolean;
		paid_duration?: number;
		placeholder?: {
			text: string;
		};
		can_publish_free_copy?: boolean;
		edit_mode?: 'all' | 'duration';
		durations?: {
			id: number;
			name: string;
		}[];
	}>;
}
