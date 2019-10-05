const process = require('process');
const ProgressBar = require('progress');
const chalk = require('chalk');
const sleep = require('./lib/sleep');
const sequelize = require('./sequelize');

const checkLastThreads = require('./checkLastThreads');

async function start() {
    try {
        await sequelize.sync();
    } catch (error) {
        console.error('Database syncing problems, the app is gonna stop (reload) now...');
        process.exit();
    }

    while (true) {
        try {
            console.log('----------------------');
            console.log('Starting a new checkup');
            await checkLastThreads('https://bitcointalk.org/index.php?board=238.0');
            const waitingProgress = new ProgressBar(`${chalk.bold.black.bgYellowBright('Waiting: :elapsed of 300 (:percent)')} | ${chalk.bgWhite.black('Progress: :bar')}`, {total: 500});
            const interval = setInterval(() => waitingProgress.tick(), (60000 * 5) / 500);
            await sleep(60000 * 5);
            clearInterval(interval);
        } catch (error) {
            console.error('Something is wrong, the app is gonna stop now...');
            process.exit();
        }
    }
}

process.on('SIGINT', () => {
    process.exit();
});

process.on('exit', () => {
    process.exit();
});

start();
