const axios = require('axios');
const {JSDOM} = require('jsdom');

module.exports = async function getLastThreads(boardUrl) {
    const boardPageRequest = await axios.get(boardUrl);

    const boardPage = new JSDOM(boardPageRequest.data);
    // .tborder td.windowbg span a, .tborder td.windowbg3 span a
    // ^^^ Если нужно абсолютно все треды на страничке, включая запиненные
    const threads = boardPage.window.document.querySelectorAll('.tborder td.windowbg span a');
    const threadsLinks = [];

    threads.forEach((thread) => {
        threadsLinks.push(thread.href);
    });

    return threadsLinks;
};
