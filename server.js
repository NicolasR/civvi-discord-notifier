// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require('express');
const config = require('./config');
const middleware = require('./middleware');
const app = express();
var bodyParser = require('body-parser');
const mappingUsersDiscord = require('./data/mapping-users-discord.json');
const mappingUsersSteam = require('./data/mapping-users-steam.json');
const routes = require('./routes');

/*
 * Logger
 * Permet de suivre les opérations du serveur
 */
function logger(message) {
    if (config.logging) {
        console.log(`[LOGGER] ${message}`);
    }
}

// Initialisation du logger
const middlewareServer = middleware.middleware(
    mappingUsersDiscord,
    mappingUsersSteam,
    logger,
);

// Initialisation du parser
app.use(bodyParser.json());

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// https://expressjs.com/en/starter/basic-routing.html
// Initialise les routes
routes.init(app, middlewareServer, config);

// listen for requests :)
const listener = app.listen(config.port, () => {
    console.log('Your app is listening on port ' + listener.address().port);
});