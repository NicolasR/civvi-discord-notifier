// config.js
const dotenv = require('dotenv');
dotenv.config();
module.exports = {
    port: process.env.PORT,
    logging: process.env.LOGGING && process.env.LOGGING === 'true',
    defaultSteamPartyID: process.env.DEFAULT_STEAMPARTYID,
    defaultChannelId: process.env.DEFAULT_CHANNEL,
    defaultNotifyPrivate: process.env.DEFAULT_NOTIFYPRIVATE && process.env.DEFAULT_NOTIFYPRIVATE === 'true',
    defaultLoginToken: process.env.DEFAULT_LOGINTOKEN,
};