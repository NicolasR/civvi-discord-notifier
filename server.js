// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require('express');
const config = require('./config');
const middleware = require('./middleware');
const app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
const mappingUsers = require('./data/mapping-users.json');

/*
 * Logger
 * Permet de suivre les opérations du serveur
 */
function logger(message) {
    if (config.logging) {
        console.log(`[LOGGER] ${message}`);
    }
}

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// https://expressjs.com/en/starter/basic-routing.html
app.get('/', (req, response) => {
    response.sendFile(__dirname + '/views/index.html');
});

app.post('/', (req, resp) =>
    middleware.handleCivVITurn(req, resp, mappingUsers, logger),
);

app.post('/raw', (req, resp) =>
    middleware.handleCivVITurnRaw(
        req,
        resp,
        mappingUsers,
        config.defaultChannelId,
        config.defaultLoginToken,
        config.defaultNotifyPrivate,
        logger,
    ),
);

// listen for requests :)
const listener = app.listen(config.port, () => {
    console.log('Your app is listening on port ' + listener.address().port);
});