import { Channel } from './channel';
import { User } from './user';

export type SlackRequestBody = {
	token: string;
	team_id: string;
	team_domain: string;
	channel_id: string;
	channel_name: string;
	user_id: string;
	user_name: string;
	command: string;
	text: string;
	response_url: string;
};

export type SlackRequest = {
	user: User;
	channel: Channel;
	text: string;
};
