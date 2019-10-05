const Sequelize = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'db.sqlite'
});

class Thread extends Sequelize.Model {}
Thread.init({
    url: Sequelize.STRING,
    // date: Sequelize.DATE
}, {sequelize, modelName: 'Thread'});

module.exports = sequelize;