const { promisify } = require('bluebird');
const { createClient } = require('lightrpc');
const client = createClient('https://api.steemit.com');
// const Client = require('lightrpc');
// const client = new Client('https://api.steemit.com');

const sendAsync = promisify(client.send, { context: client });

const limit = 100;

async function getAll(tag) {
  const posts = [];
  const result = await sendAsync('get_discussions_by_blog', [{ tag, limit }]);
  posts.push(...result.filter(e => e.author === tag));

  let received = 0;
  do {
    const startAuthor = posts[posts.length - 1].author;
    const startPermlink = posts[posts.length - 1].permlink;

    const moreResult = await sendAsync('get_discussions_by_blog', [
      { tag, limit, start_author: startAuthor, start_permlink: startPermlink },
    ]);

    posts.push(...moreResult.slice(1).filter(e => e.author === tag));
    received = moreResult.length;
  } while (received === limit);
  return posts;
}

module.exports = getAll;