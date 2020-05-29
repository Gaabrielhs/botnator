/*
 *
 *  09/08/2019 19:20 by Gaabrielhs
 *  Return a youtube url from searchQuery using googleapis
 *
 */

const { google } = require('googleapis');

const authToken = process.env.GOOGLE_API;

const youtube = google.youtube({
  version: 'v3',
  auth: authToken,
});

const baseUrl = 'https://www.youtube.com/watch?v=';

async function search(searchQuery) {
  const res = await youtube.search.list({
    part: 'id',
    type: 'video',
    maxResults: 1,
    q: searchQuery,
  });

  if (res.data.items.length === 0) return null;
  const { videoId } = res.data.items[0].id;
  return baseUrl + videoId;
}

module.exports = { search };
