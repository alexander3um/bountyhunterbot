const axios = require('axios');
const moment = require('moment');
const {JSDOM} = require('jsdom');

const config = require('../config');

module.exports = async function checkThread(threadUrl) {
    const threadPageRequest = await axios.get(threadUrl);

    const threadPage = new JSDOM(threadPageRequest.data);
    const threadDateDomElement = threadPage.window.document.querySelector('form#quickModForm table tbody tr:first-child .td_headerandpost table tbody tr td:nth-child(2) .smalltext');
    const isThreadEdited = threadDateDomElement.firstChild instanceof threadPage.window.HTMLSpanElement;
    const threadDateString = isThreadEdited ?
        threadDateDomElement.querySelector('span').innerHTML :
        threadDateDomElement.innerHTML;

    const threadDate = threadDateString.search(/^(<b>Today<\/b>)/igm) === -1 ?
        moment(threadDateString, 'LLL') :
        moment(threadDateString.slice(16), 'LT');
    const today = moment();
    const todayThreadDifference = today.diff(threadDate, 'days');

    if (todayThreadDifference <= config.maxDays) {
        return {url: threadUrl, date: threadDate, difference: todayThreadDifference};
    }

    return;
};
