import { User } from '../common/domain';

export type AddSongAction = {
	type: 'add-song';
	artist: string;
	trackName: string;
};

export type HelpAction = {
	type: 'help';
};

export type ShowQueueAction = {
	type: 'show-queue';
};

export type SpotifyAction = AddSongAction | HelpAction | ShowQueueAction;

export type SlackParser = {
	toSpotifyAction: (text: string) => SpotifyAction;
};

export const slackParser: SlackParser = {
	toSpotifyAction: (text: string): SpotifyAction => {
		const textPrefix = text.split(' ')[0];

		switch (textPrefix) {
			case 'add':
				const str = text.slice(4).split(' - ');
				const artist = str[0] || '';
				const trackName = str[1] || '';

				return {
					type: 'add-song',
					artist,
					trackName
				};
			case 'queue':
				return {type: 'show-queue'};
			case 'help':
			default:
				return {type: 'help'};
		}
	}
};
