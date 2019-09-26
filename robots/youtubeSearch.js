/*
 *
 *  09/08/2019 19:20 by Gaabrielhs
 *  Return a youtube url from searchQuery using googleapis
 *
 */

const {google} = require('googleapis');
const auth_token = require('../config/discord.json').credentials.google_api;

const youtube = google.youtube({
    version: 'v3',
    auth: auth_token
});

const base_url = 'https://www.youtube.com/watch?v=';

async function search (searchQuery) {
    const res = await youtube.search.list({
        part: 'id',
        type: 'video',
        maxResults: 1,
        type: 'video',
        q: searchQuery
    });

    if(res.data.items.length == 0) return null;
    const videoId = res.data.items[0].id.videoId;
    return base_url + videoId;
}

module.exports = search;