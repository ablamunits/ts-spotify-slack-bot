# ts-spotify-slack-bot
### Enable Slack users to add songs to your Spotify playlist. Written in Typescript / Node.js

There is always this one person in the office that plays music through their speakers. Why not let everyone join in on the fun?
If you love listening to music on Spotify and also use Slack - you can now stop handling song requests from your co-workers and just
let them add any tune they want to a pre-defined Spotify playlist, directly from Slack.

This is a WIP pet-project I created to enable a `/spotify` [Slash Command](https://api.slack.com/slash-commands) in our Slack environment.
Users can add songs to a dedicated playlist by typing `/spotify add [artist] - [track]`.

### How can I use this myself?

- To use this app you will first need to add a Slack [Slash Command](https://api.slack.com/slash-commands) that will `POST`
to `/spotify/slackbot`.
- You will also need to register a Spotify Application and obtain a Spotify Client ID and Client Secret. These are used for authentication
when you run the app. You can find more information in Spotify's [Web API Authorization Guide](https://developer.spotify.com/web-api/authorization-guide/).

- Once you have registered your Spotify application, you will need to define some environment variables:

`SPOTIFY_CLIENT_ID` - Spotify Client ID

`SPOTIFY_CLIENT_SECRET` - Spotify Secret

`SPOTIFY_REDIRECT_URI` - The authentication callback url should redirect to `auth-callback`, for example: https://localhost:8001/auth-callback

`SPOTIFY_PLAYLIST_ID` - The playlist Id, to which tracks will be added

`SPOTIFY_PLAYLIST_OWNER_ID` - The Id of the user who is the owner of the playlist

`SLACK_ALLOWED_CHANNEL_ID` - Optional. The Slack Channel Id where users can request songs from.

- Deploy the app or run it locally. Authenticate the app with Spotify by opening the browser to `/auth`. If the authentication is successfull, your app is ready to take song requests from slack.
- Open Slack and try adding a song to your playlist, like this: `/spotify add Queen - I Want To Break Free`.

### Contributions

Since this app currently only supports adding songs to a playlist, I would love to make it more fun.
Contributions are always very welcome, and feel free to reach out with what you would love to see.
