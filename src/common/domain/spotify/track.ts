import { Artist } from './artist';

export type TrackImage = {
	height: number;
	width: number;
	url: number;
};

export type Track = {
	id: string;
	name: string;
	artists: Artist[];
	durationMs: number;
	images: TrackImage[];
};
