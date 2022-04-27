export * from './attachments';

export interface VKEvent {
	group_id?: number;
	type?: string;
	event_id?: string;
	v?: string;
	object?: object;
	secret?: string;
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
	comments?: {
		count: number;
		can_post: number;
		groups_can_post: number;
		can_close: number;
		can_open: number;
	};
	copyright?: {
		id?: number;
		link: string;
		name: string;
		type: string;
	};
	likes?: {
		count: number;
		user_likes: number;
		can_like: number;
		can_publish: number;
	};
	reposts?: {
		count: number;
		user_reposted: number;
	};
	views?: {
		count: number;
	};
	post_type?: string;
	post_source?: {
		type: string;
		platform: string;
		data: string;
		url: string;
	};
	attachments?: object[];
	geo?: object;
	signer_id?: number;
	copy_history?: Post[];
	can_pin?: number;
	can_delete?: number;
	can_edit?: number;
	is_pinned?: number;
	marked_as_ads?: number;
	is_favorite?: number;
	donut?: {
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
	};
}
