import { appConfig } from '../config';
import { SlackRequestBody, SlackRequest } from '../common/domain';

export const isAllowedChannel = (channelId: string) => {
	const {slack} = appConfig;

	return slack.allowedChannelId ? slack.allowedChannelId === channelId : true;
};

export const translateSlackRequestBody = (data: SlackRequestBody): SlackRequest => {
	const channelId = data.channel_id;
	const userName = data.user_name;
	const text = data.text;

	return {
		user: {
			name: userName
		},
		text,
		channel: {
			id: data.channel_id,
			name: data.channel_name
		}
	};
};

export const getRandomBotResponse = (userName: string): string => {
	const responses = [
		`Alright! ${userName} just added a song to the playlist!`,
		`Nice choice, ${userName}!`,
		`Woah! ${userName} really wants to get the party started!`,
		`We have a new request from ${userName}`,
		`Thanks to ${userName} you can start dancing!`,
		`We got a nice addition from ${userName}`,
		`Thanks for the request, ${userName}`
	];

	return responses[Math.floor(Math.random() * responses.length)];
};
