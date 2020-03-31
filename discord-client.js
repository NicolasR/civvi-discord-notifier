const Discord = require('discordjs-stable');

module.exports = {
    /*
     * Initialisation du client
     */
    client: function() {
        const client = new Discord.Client();
        var isReady = false;

        /*
         * Vérifie que la connexion vers le client est ouverte
         * @param loginToken token vers le bot associé
         */
        function ensureReady(loginToken) {
            return new Promise((resolve, reject) => {
                if (isReady) {
                    resolve();
                    return;
                }

                // Lorsque la connexion est prête, l'évènement se déclenche
                client.once('ready', () => {
                    isReady = true;
                    resolve();
                });

                try {
                    // Connexion au bot Discord
                    client.login(loginToken).catch(reject);
                } catch (ex) {
                    reject(ex);
                }
            });
        }

        return {
            /*
             * Permet d'envoyer un message privé à un utilisateur
             * @param loginToken token vers le bot Discord
             * @param userId identifiant de l'utilisateur
             * @param message message à envoyer
             */
            sendPrivateMessage: function(loginToken, userId, message) {
                return new Promise((resolve, reject) =>
                    ensureReady(loginToken)
                    .then(() => {
                        const user = client.users.get(userId);
                        if (!user) {
                            reject(`User ${userId} not found`);
                            return;
                        }

                        return user.send(message);
                    }, reject)
                    .then(resolve, reject),
                );
            },

            /*
             * Permet d'envoyer un message sur un channel
             * @param loginToken token vers le bot Discord
             * @param channelId identifiant du channel
             * @param message message à envoyer
             */
            sendMessageToChannel: function(loginToken, channelId, message) {
                return new Promise((resolve, reject) =>
                    ensureReady(loginToken)
                    .then(() => {
                        const channel = client.channels.get(channelId);
                        if (!channel) {
                            reject(`Channel ${channelId} not found`);
                            return;
                        }
                        return channel.send(message);
                    }, reject)
                    .then(resolve, reject),
                );
            },

            /*
             * Fermeture de la connexion au client
             */
            closeClient: function() {
                if (!isReady) {
                    return;
                }

                client.destroy();
                isReady = false;
            },
        };
    },
};