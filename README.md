# civvi-discord-notifier

<img src="https://user-images.githubusercontent.com/206826/78589999-658a6f00-7841-11ea-94f1-3d3571a58460.png" alt="alt text" width="400px" >

Serveur permettant d'envoyer des notifications depuis une partie **Cloud Civilization VI** vers **Discord**.

Le serveur gère à la fois les valeurs du webhook standard de Civilization VI mais aussi un appel custom permettant de passer facilement les paramètres tels que l'id de partie ou le token d'authentification Discord.


## Configuration

Le fichier .env contient les variables de configuration utilisées.

Le mapping entre **Nom d'utilisateur** et **Id Discord** doit être écrit dans le fichier **mapping-users-discord.json**

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
    "gameName": "Nom_de_la_partie",
    "turn": "Numero_du_tour"
}
```

|  Nom du paramètre  |  Description  |  Obligatoire  |
|        :---        |      :---     |     :---:     |
| username           | Nom de l'utilisateur | &#x2611; |
| loginToken         | Token d'authentification du Bot | &#x2611;
| channelId          | Id du channel Discord où sera postée la notification  | &#x2611; |
| steamPartyId | Id de la partie |  |
| gameName | Nom de la partie |  |
| turn | Numéro du tour |  |

### Format POST /raw

Format JSON attendu:

```json
{
    "Value1": "Nom_de_la_partie",
    "Value2": "Nom_utilisateur",
    "Value3": "Numero_tour",
}
```

|  Nom du paramètre  |  Description         |  Obligatoire  |
|        :---        |      :---            |     :---:     |
| Value1             | Nom de la partie     |               |
| Value2             | Nom de l'utilisateur | &#x2611;      |
| Value3             | Numéro du tour       |               |

Dans ce cas-ci, les paramètres utilisés sont ceux récupérés depuis le jeu. Il conviendra donc de paramétrer dans le fichier **env** les variables suivantes afin que les notifications fonctionnent:

|  Nom du paramètre     | Description                       |
|  :---                 | :---                              |
| DEFAULT_CHANNEL       | Numéro du channel Discord         |
| DEFAULT_LOGINTOKEN    | Token d'authentification du Bot   |
