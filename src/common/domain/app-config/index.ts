import { Playlist } from '../spotify/playlist';

export type SpotifyConfig = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
	scope: string,
	playlist: Playlist;
};

export type SlackConfig = {
	allowedChannelId: string;
};

export type AppConfig = {
	spotify: SpotifyConfig;
	slack: SlackConfig;
};
