import { Playlist, SlackConfig, SpotifyConfig } from './common/domain';

const spotifyConfig: SpotifyConfig = {
	clientId: process.env.SPOTIFY_CLIENT_ID,
	clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
	redirectUri: process.env.SPOTIFY_REDIRECT_URI,
	scope: 'user-read-private user-read-email user-top-read playlist-modify-public playlist-modify-private',
	playlist: {
		ownerId: process.env.SPOTIFY_PLAYLIST_OWNER_ID,
		id: process.env.SPOTIFY_PLAYLIST_ID
	}
};

const slackConfig: SlackConfig = {
	// If allowedChannelId is not set, the slack bot can be triggered from every channel
	allowedChannelId: process.env.SLACK_ALLOWED_CHANNEL_ID
};

export const appConfig = {
	spotify: spotifyConfig,
	slack: slackConfig
};
