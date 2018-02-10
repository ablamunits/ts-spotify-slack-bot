import * as SpotifyWebApi from 'spotify-web-api-node';
import { log } from './../common/logger';
import { SpotifyConfig, SpotifyAccessToken, Playlist, Track, } from './../common/domain';

export type SearchSongDto = {
	track: string;
	artist: string;
};

export type SpotifySearchResult<T> = {
	data: T | null;
	error: string | null;
};

export type SpotifyPlaylistApi = {
	addSong: (song: SearchSongDto) => Promise<SpotifySearchResult<Track>>;
};

export const createSpotifyPlaylistApi = (authCode: string) => async (config: SpotifyConfig): Promise<SpotifyPlaylistApi> => {
	const spotify = new SpotifyWebApi(config);
	let tokenExpiresIn: number;

	log('Creating Spotify Playlist API ...');

	const spotifyTokenData = await spotify.authorizationCodeGrant(authCode);

	const accessToken: SpotifyAccessToken = {
		token: spotifyTokenData.body.access_token,
		refreshToken: spotifyTokenData.body.refresh_token,
		expiresIn: spotifyTokenData.body.expires_in
	};

	spotify.setAccessToken(accessToken.token);
	spotify.setRefreshToken(accessToken.refreshToken);

	tokenExpiresIn = accessToken.expiresIn;
	log(`Got Spotify token. Expires in ${accessToken.expiresIn}`);

	const refreshAccessToken = () => {
		log('Time to refresh access token...');

		spotify.refreshAccessToken().then((data) => {
			log(`Refreshed Access Token!`);
			tokenExpiresIn = data.body.expires_in;
		});
	};

	setInterval(() => {
		tokenExpiresIn -= 1;

		if (tokenExpiresIn < 1800) {
			refreshAccessToken();
		}
	}, 1000);

	log('Ready!');

	return {
		addSong: async (song: SearchSongDto): Promise<SpotifySearchResult<Track>> => {
			try {
				log(`Starting track search track:${song.track} artist:${song.artist}`);
				const data = await spotify.searchTracks(`track:${song.track} artist:${song.artist}`);
				const tracks = data.body.tracks;
				log(`Track search complete: ${tracks}`);

				const selectedTrack = tracks.total ? tracks.items[0] : null;
				const pickedSong: Track = selectedTrack ? {
					id: selectedTrack.id,
					name: selectedTrack.name,
					artists: selectedTrack.artists,
					durationMs: selectedTrack.duration_ms,
					images: selectedTrack.album.images || []
				} : null;

				log(`Attempting to add found track to playlist ${config.playlist.id} owned by ${config.playlist.ownerId}`);

				await spotify.addTracksToPlaylist(config.playlist.ownerId, config.playlist.id, [`spotify:track:${pickedSong.id}`]);

				log(`Added ${pickedSong.artists[0].name} - ${pickedSong.name} to the playlist successfully`);

				return {data: pickedSong, error: null};
			} catch (e) {
				log(`Error for request artist: ${song.artist}, track: ${song.track}`);
				log(e);
				return {data: null, error: 'Could not pick song :('};
			}
		}
	};
};
