const axios = require('axios');
const ProgressBar = require('progress');
const chalk = require('chalk');
const sleep = require('./lib/sleep');
const checkThread = require('./checkThread');
const getLastThreads = require('./getLastThreads');
const sendTelegramMessage = require('./sendTelegramMessage');
const sequelize = require('./sequelize');
const {Op} = require('sequelize');

module.exports = async function checkLastThreads(boardUrl) {
    const threadsUrls = await getLastThreads(boardUrl);
    const threadsList = [];
    const checkProgress = new ProgressBar(`${chalk.bold.bgCyan('Checking: :current of :total')} | ${chalk.bgWhite.black('Progress: :bar')}`, {total: threadsUrls.length});

    for (let url of threadsUrls) {
        threadsList.push(await checkThread(url));
        checkProgress.tick();
        await sleep(1000);
    }

    const newThreadsList = [];
    for (let thread of threadsList.filter(thread => thread)) {
        const result = await sequelize.model('Thread').findOne({
            where: {url: thread.url}
        });

        if (!result) {
            newThreadsList.push(thread);
        }
    }

    if (newThreadsList < 1) {
        console.log(`No new threads yet\n`);
        return;
    }

    const createResults = await sequelize.model('Thread').bulkCreate(newThreadsList.map(({url}) => ({url})));

    const newThreadsListToDisplay = newThreadsList.map((thread) => {
        const toDisplay = `${thread.date.format('LLL')} - ${thread.url}`;
        return thread.difference <= 1 ? chalk.bgRedBright.black(toDisplay) : chalk.greenBright(toDisplay);
    });

    const newThreadsToSend = newThreadsList.map((thread) => `📌 ${thread.date.format('LLL')} - ${thread.url}`);

    console.log(newThreadsListToDisplay.join('\n'));
    sendTelegramMessage(newThreadsToSend.join('\n'));
};
