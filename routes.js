module.exports = {
    init: function(app, middleware, config) {
        app.get('/', (_, response) => {
            response.sendFile(__dirname + '/views/index.html');
        });

        // Gère la redirection vers Steam (Discord ne gère pas les procoles customs)
        app.get('/redirect', (req, response) => {
            const urlToRedirect = req.query.dest;
            if (urlToRedirect) {
                response.writeHead(301, {
                    Location: decodeURIComponent(urlToRedirect),
                });
            }

            response.end();
        });

        app.post('/', (req, resp) => middleware.handleCivVITurn(req, resp));

        app.post('/raw', (req, resp) =>
            middleware.handleCivVITurnRaw(
                req,
                resp,
                config.defaultChannelId,
                config.defaultLoginToken,
                config.defaultNotifyPrivate,
                config.defaultSteamPartyID,
            ),
        );
    },
};