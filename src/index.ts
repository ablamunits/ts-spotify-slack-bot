import * as express from 'express';
import * as request from 'request';
import * as bodyParser from 'body-parser';
import { appConfig } from './config';
import { log } from './common/logger';
import { isAllowedChannel, translateSlackRequestBody } from './common/slack-utils';
import { SpotifyPlaylistApi, createSpotifyPlaylistApi, SearchSongDto, SpotifySearchResult } from './spotify/spotify.api';
import { slackParser } from './slack/slack-parser';
import { SpotifySlackBot, createSpotifySlackBot } from './spotify-slack-bot';

const PORT = process.env.PORT || 8001;
const app = express();

let spotifySlackBot: SpotifySlackBot;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/auth', (req, res) => {
	res.redirect(`https://accounts.spotify.com/authorize/?client_id=${appConfig.spotify.clientId}&response_type=code&redirect_uri=${appConfig.spotify.redirectUri}&scope=${encodeURIComponent(appConfig.spotify.scope)}`);
});

app.get('/auth-callback', async (req, res) => {
	const code = req.query.code;
	try {
		const spotifyApi = await createSpotifyPlaylistApi(code)(appConfig.spotify);
		spotifySlackBot = createSpotifySlackBot(spotifyApi);
		res.sendStatus(200);
	} catch (e) {
		res.status(500).send('Could not initiate playlist service');
	}
});

app.post('/spotify/slackbot', async (req, res) => {
	if (!spotifySlackBot) {
		log('Called /spotify/slackbot when no playlist service is available');
		res.status(500).send('Got a request to /spotify/slackbot, but no spotify playlist. Did you forget to /auth ?');
	} else {
		const data = translateSlackRequestBody(req.body);
		const user = data.user;

		if (!isAllowedChannel(data.channel.id)) {
			log(`${data.user.name} tried to call spotify slack bot in ${data.channel.name} (${data.channel.id}), and its not allowed.`);
			res.status(403).send('The /spotify command is only allowed in some channels.');
			return;
		}

		const action = slackParser.toSpotifyAction(data.text);
		const response = await spotifySlackBot.runAction(action, user);

		res.status(200).send(response);
	}
});

app.listen(PORT, () => {
	log(`Spotify server now listening on ${PORT}.`);
});
