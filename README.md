# civvi-discord-notifier

Serveur permettant d'envoyer des notifications depuis une partie Cloud Civilization VI vers Discord.


## Configuration

Le fichier .env contient les variables de configuration utilisées.
Le mapping entre **Nom d'utilisateur** et **Id Discord** doit être écrit dans le fichier **mapping-users-discord.json**
Le mapping entre **Nom d'utilisateur** et **Id Steam** doit être écrit dans le fichier **mapping-users-steam.json**


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
    "steamPartyId": "Id_de_la_partie",
}
```

|  Nom du paramètre  |  Description  |  Obligatoire  |
|        :---        |      :---     |     :---:     |
| username           | Nom de l'utilisateur | &#x2611; |
| loginToken         | Token d'authentification du Bot | &#x2611;
| channelId          | Id du channel Discord où sera postée la notification  | &#x2611; |
| steamPartyId | Id de la partie | &#x2612; |
| gameName | Nom de la partie | &#x2612; |
| turn | Numéro du tour | &#x2612; |

### Format POST /raw

Format JSON attendu:

```json
{
    "Value1": "Nom_de_la_partie",
    "Value2": "Nom_utilisateur",
    "Value3": "Numero_tour",
}
```