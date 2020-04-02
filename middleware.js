const discordClient = require('./discord-client').client();

/*
 * Gestion des erreurs
 */
function handleError(ex, response) {
    console.error(`An error occured: ${ex.toString()}`);
    response.json({ error: ex.toString() });
}

/*
 * Renvoie l'url du serveur
 */
function getServerUrl(req) {
    return req.protocol + '://' + req.get('host');
}

/*
 * Récupère le nom d'utilisateur
 * TODO: Gérer les cas avec des espaces et caractères spéciaux (hein Dalkilol ;) )
 */
function getUserIdFromUsername(username, mappingUsers) {
    const userName = username.split(' ')[0];
    var userId = mappingUsers[userName];

    // On n'a pas trouvé l'id associé, on envoie le nom d'utilisateur en brut => la personne ne sera pas mentionnée
    if (!userId) {
        userId = userName;
    }

    return userId;
}

function processSendMessage(
    serverUrl,
    response,
    userId,
    userSteamId,
    channelId,
    loginToken,
    notifyPrivate,
    steamPartyId,
    logger,
) {
    logger(`Found associated Discord User Id: ${userId}`);
    logger(`Found associated Steam User Id: ${userSteamId}`);
    logger(`Private message enabled: ${notifyPrivate}`);

    // Construction du message à envoyer
    const emoji = `:smiling_imp:694108249145737247`;
    const message = `C'est à toi de jouer <@${userId}> <${emoji}> !`;

    let description = message;
    if (steamPartyId && userSteamId) {
        const gameUrl = encodeURIComponent(
            `steam://run/289070//?_sessionid=${userSteamId};_context=${steamPartyId}`,
        );
        const fullUrl = `${serverUrl}/redirect?dest=${gameUrl}`;
        description += `\nTu peux rejoindre la partie en cliquant **[ICI](${fullUrl})**`;
    }

    const embedMessage = {
        embed: {
            title: '**Nouveau tour de jeu !** 😃',
            description: description,
            color: 16700449,
            //timestamp: '2020-04-02T09:34:15.921Z',
            footer: {},
            thumbnail: {
                url: 'https://steamcommunity-a.akamaihd.net/public/images/profile/profile_gamenotifications_turnicon.png',
            },
            image: {
                url: 'https://steamcdn-a.akamaihd.net/steam/apps/289070/capsule_184x69.jpg',
            },
            fields: [],
        },
    };

    const handleChannelMessage = () =>
        discordClient
        .sendMessageToChannel(loginToken, channelId, message)
        .then(() =>
            discordClient.sendMessageToChannel(loginToken, channelId, embedMessage),
        );

    logger(`Sending message '${message}' to ${userId}`);
    let messengingProcess;
    if (notifyPrivate) {
        messengingProcess = () =>
            discordClient
            .sendPrivateMessage(loginToken, userId, message)
            .then(
                () => discordClient.sendPrivateMessage(loginToken, userId, message),
                ex => handleError(ex, response),
            )
            .then(handleChannelMessage, ex => handleError(ex, response));
    } else {
        messengingProcess = handleChannelMessage;
    }

    messengingProcess().then(
        () => {
            discordClient.closeClient();
            response.end();
            logger(`All Done :)`);
        },
        ex => handleError(ex, response),
    );
}

module.exports = {
    middleware: function(mappingUsersDiscord, mappingUsersSteam, logger) {
        const _mappingUsersDiscord = mappingUsersDiscord;
        const _mappingUsersSteam = mappingUsersSteam;
        const _logger = logger;

        return {
            handleCivVITurnRaw: function(
                request,
                response,
                channelId,
                loginToken,
                notifyPrivate,
                steamPartyId,
            ) {
                _logger(
                    'Received request for handling Civilization VI Turn notifications (RAW mode) !',
                );

                // Vérification de la présence de tous les paramètres
                if (!request.body.Value1 ||
                    !request.body.Value2 ||
                    !request.body.Value3
                ) {
                    _logger('Missing parameters, abort !');
                    response.json({ error: 'missing parameters' });
                    return;
                }

                _logger('Parameters OK !');

                // Récupération du nom d'utilisateur
                const userName = request.body.Value2;
                _logger(`Reading username: ${userName}`);
                const userId = getUserIdFromUsername(userName, _mappingUsersDiscord);
                const userSteamId = getUserIdFromUsername(userName, _mappingUsersSteam);

                processSendMessage(
                    getServerUrl(request),
                    response,
                    userId,
                    userSteamId,
                    channelId,
                    loginToken,
                    notifyPrivate,
                    steamPartyId,
                    logger,
                );
            },

            handleCivVITurn: function(request, response) {
                _logger(
                    'Received request for handling Civilization VI Turn notifications !',
                );

                // Vérification de la présence de tous les paramètres
                if (!request.body.username ||
                    !request.body.channelId ||
                    !request.body.loginToken
                ) {
                    _logger('Missing parameters, abort !');
                    response.json({ error: 'missing parameters' });
                    return;
                }

                _logger('Parameters OK !');

                // Récupération du nom d'utilisateur
                const userName = request.body.username;
                _logger(`Reading username: ${userName}`);
                const userId = getUserIdFromUsername(userName, _mappingUsersDiscord);
                const userSteamId = getUserIdFromUsername(userName, _mappingUsersSteam);

                const channelId = request.body.channelId;
                const loginToken = request.body.loginToken;
                const notifyPrivate = request.body.notifyPrivate ?
                    request.body.notifyPrivate :
                    false;
                const steamPartyId = request.body.steamPartyId;
                processSendMessage(
                    getServerUrl(request),
                    response,
                    userId,
                    userSteamId,
                    channelId,
                    loginToken,
                    notifyPrivate,
                    steamPartyId,
                    logger,
                );
            },
        };
    },
};