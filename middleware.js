const discordClient = require('./discord-client').client();

/*
 * Gestion des erreurs
 */
function handleError(ex, response) {
    console.error(`An error occured: ${ex.toString()}`);
    response.json({ error: ex.toString() });
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
    response,
    userId,
    channelId,
    loginToken,
    notifyPrivate,
    logger,
) {
    // Préparation des variables pour Discord
    logger(`Found associated userid: ${userId}`);
    logger(`Private message enabled: ${notifyPrivate}`);

    // Construction du message à envoyer
    const emoji = `:smiling_imp:694108249145737247`;
    const message = `C'est à toi de jouer <@${userId}> <${emoji}> !`;

    const handleChannelMessage = () =>
        discordClient.sendMessageToChannel(loginToken, channelId, message);

    logger(`Sending message '${message}' to ${userId}`);
    let messengingProcess;
    if (notifyPrivate) {
        messengingProcess = () =>
            discordClient
            .sendPrivateMessage(loginToken, userId, message)
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
    handleCivVITurnRaw: function(
        request,
        response,
        mappingUsers,
        channelId,
        loginToken,
        notifyPrivate,
        logger,
    ) {
        logger(
            'Received request for handling Civilization VI Turn notifications (RAW mode) !',
        );

        // Vérification de la présence de tous les paramètres
        if (!request.body.Value1 || !request.body.Value2 || !request.body.Value3) {
            logger('Missing parameters, abort !');
            response.json({ error: 'missing parameters' });
            return;
        }

        logger('Parameters OK !');

        // Récupération du nom d'utilisateur
        const userName = request.body.Value2;
        logger(`Reading username: ${userName}`);
        const userId = getUserIdFromUsername(userName, mappingUsers);

        processSendMessage(
            response,
            userId,
            channelId,
            loginToken,
            notifyPrivate,
            logger,
        );
    },

    handleCivVITurn: function(request, response, mappingUsers, logger) {
        logger(
            'Received request for handling Civilization VI Turn notifications !',
        );

        // Vérification de la présence de tous les paramètres
        if (!request.body.username ||
            !request.body.channelId ||
            !request.body.loginToken
        ) {
            logger('Missing parameters, abort !');
            response.json({ error: 'missing parameters' });
            return;
        }

        logger('Parameters OK !');

        // Récupération du nom d'utilisateur
        const userName = request.body.username;
        logger(`Reading username: ${userName}`);
        const userId = getUserIdFromUsername(userName, mappingUsers);

        const channelId = request.body.channelId;
        const loginToken = request.body.loginToken;
        const notifyPrivate = request.body.notifyPrivate;
        processSendMessage(
            response,
            userId,
            channelId,
            loginToken,
            notifyPrivate,
            logger,
        );
    },
};