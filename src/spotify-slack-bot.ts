import { SpotifyAction, AddSongAction } from './slack/slack-parser';
import { SlackResponseBody, SlackResponseType, User } from './common/domain';
import { SearchSongDto, SpotifyPlaylistApi } from './spotify/spotify.api';
import { getRandomBotResponse } from './common/slack-utils';

export type SpotifySlackBot = {
	runAction: (action: SpotifyAction, user: User) => Promise<SlackResponseBody>;
};

export const createSpotifySlackBot = (api: SpotifyPlaylistApi): SpotifySlackBot => {
	const addSong = async (action: AddSongAction, user: User): Promise<SlackResponseBody> => {
		const dto: SearchSongDto = {artist: action.artist, track: action.trackName};
		const searchResult = await api.addSong(dto);
		const track = searchResult.data;

		if (searchResult.error) {
			return {
				response_type: 'ephemeral',
				text: `Oops. I could not find a track for ${action.artist} - ${action.trackName}`
			};
		} else {
			const slackResponse = {
				response_type: 'in_channel' as SlackResponseType,
				attachments: [
					{
						fallback: 'A song has been added to the playlist!',
						color: '#36a64f',
						pretext: getRandomBotResponse(user.name),
						author_name: track.artists[0].name,
						title: track.name,
						thumb_url: track.images[0].url
					}
				]
			};
			return slackResponse;
		}
	};

	return {
		runAction: (action: SpotifyAction, user: User) => {
			switch (action.type) {
				case 'add-song': return addSong(action, user);
			}
		}
	};
};
