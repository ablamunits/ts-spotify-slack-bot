export type SlackResponseType = 'in_channel' | 'ephemeral';

export type SlackResponseBody = {
	response_type: SlackResponseType
	text?: string;
	attachments?: any;
};
