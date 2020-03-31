# civvi-discord-notifier

Serveur permettant d'envoyer des notifications depuis une partie Cloud Civilization VI vers Discord.


## Configuration

Le fichier .env contient les variables de configuration utilisées.
Le mapping entre **Nom d'utilisateur** doit être écrit dans le fichier **mapping-users.json**


## Requêtes

Deux types de requêtes possibles:
* Requête POST vers **/**
* Requête POST vers **/raw**

### Format POST /

Format JSON attendu:

```json
{
    "username": "Nom_utilisateur",
    "loginToken": "Login_token_discord",
    "channelId": "Id_Channel_discord",
}
```

### Format POST /raw

Format JSON attendu:

```json
{
    "Value1": "Nom_de_la_partie",
    "Value2": "Nom_utilisateur",
    "Value3": "Numero_tour",
}
```