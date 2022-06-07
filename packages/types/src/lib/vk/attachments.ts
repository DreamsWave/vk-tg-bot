export interface PhotoSize {
	type: string;
	url: string;
	width: number;
	height: number;
}
export interface Photo {
	id: number;
	owner_id: number;
	access_key?: string;
	album_id?: number;
	user_id?: number;
	text?: string;
	date?: number;
	sizes?: PhotoSize[];
	width?: number;
	height?: number;
}

export interface Video {
	id: number;
	owner_id: number;
	access_key?: string;
	repeat?: number;
	can_add?: number;
	can_edit?: number;
	processing?: number;
	live?: number;
	upcoming?: number;
	is_favorite?: boolean;
	title?: string;
	description?: string;
	duration?: number;
	date?: number;
	adding_date?: number;
	views?: number;
	comments?: number;
	player?: string;
	platform?: string;
}

export interface Document {
	id: number;
	owner_id: number;
	access_key?: string;
	title?: string;
	size?: number;
	ext?: string;
	url?: string;
	date?: number;
	type?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
	preview?: {
		photo?: PhotoSize[];
		graffiti?: {
			src: string;
			width: number;
			height: number;
		};
		audio_message?: {
			duration: number;
			waveform: number[];
			link_ogg: string;
			link_mp3: string;
		};
	};
}

export interface Attachment {
	type: 'photo' | 'video' | 'doc' | 'audio';
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key: string]: any;
}
