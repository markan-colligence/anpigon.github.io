const fs = require('fs');
const path = require('path');
// const Remarkable = require('remarkable');
const getAll = require('./get-all');

(async function() {
// exports.sourceNodes = async ({ boundActionCreators }, { path, tag, sortBy }) => {
  // const { createNode } = boundActionCreators;

  // const md = new Remarkable();
  // function makeSummary(text) {
  //   let summary = md.render(text);
  //   summary = summary.replace(/<(?:.|\n)*?>/gm, '');
  //   //summary = summary.replace(/(<([^>]+)>)/ig, "");
  //   summary = summary.replace(/(http(s)?:\/\/steemitimages.com\/([0-9]+x[0-9]+)\/)?http(s)?:\/\/(\w*:\w*@)?[-\w.]+(:\d+)?(\/([\w/_.]*(\?\S+)?)?)?/g, '');
  //   summary = summary.replace(/(\s)+Sponsored \( Powered by dclick \)(.|\n)*/im, '');
  //   summary = summary.replace(/\n/g,' ').replace(/\"/g, '');
  //   return summary.slice(0, 200).trim() + (summary.length > 200 ? "..." : "");
  // }

  const cateRegExp = new RegExp(/(?<=^\[)([^/]*)(?=\])/g);
  function parseCategory(text) {
    // let category = (text.match(/(?<=^\[)([a-zA-Zㄱ-힣\s]*)(?=\])/g)
    // let category = (text.match(/(?<=^\[)([^/]*)(?=\])/g)
    if(cateRegExp.test(text)) {
      let [ category ] = text.match(cateRegExp)
      return category.replace(/#\d{0,3}/g, '').trim();
    }    
    return null;
  }

  function createPost(post) {
    const date = new Date(`${post.created}Z`);
    const json_metadata = JSON.parse(post.json_metadata);
    // const tags = json_metadata.tags || [];
    let title = post.title.replace(/\"/g, '').trim();
		let category = json_metadata.category || (parseCategory(title) || "ETC"); //title.match(/(?<=^\[)([^}]*)(?=\])/g)
		category = category.toLowerCase().replace(/\s/g, '');
		title = title.replace(cateRegExp, '').replace(/\[[^\]]*\]\s?|/, ''); // 제목에서는 카테고리 제거
    // const summary = makeSummary(post.body);
    const content = [
      '---',
      `layout: post`,
      `title: "${title}"`,
      // `author: ${post.author}`,
      `date: "${post.created}Z"`,
      // `draft: false`,
      `path: "${post.url}"`,
      `category: "${category}"`,
      // `tags:`,
      // ...tags.map(tag => `  - "${tag}"`),
      // `description: "${summary}"`,
      '---',
      `${post.body}`
    ]
		const fileName = `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2,'0')}-${(date.getDate()).toString().padStart(2,'0')}---${post.permlink}`;
		// const fileName = `${post.permlink}`;
    fs.writeFileSync(`${path.resolve(__dirname, '_posts')}/${fileName}.md`, content.join('\n'), 'utf8');
  }

	// 포스트 모두 가져오기
  const posts = await getAll('anpigon');
  posts.forEach(post => {
    createPost(post); // md 파일 생성
  });
// };
})();

// console.log(__dirname);
// console.log(path.dirname(__filename))
// console.log(path.resolve(__dirname, '_posts'))