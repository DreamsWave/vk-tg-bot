# YC Bot

Bot for reposting posts from VK group to Telegram channel

## Requirements

-   Yandex Cloud CLI ^0.91.0
-   Terraform ^1.1.6

## Installation

-   `npm install`
-   `yc init`
-   `cp terraform.tfvars_ terraform.tfvars && cp .env.example .env`
-   `yc config list`
-   Fill "terraform.tfvars" and ".env"(optional for dev)
-   `terraform init`
-   `npm run build`
-   `npm run deploy`
-   Copy `entry_url` from console output or from Yandex Cloud API Gateway Domain and paste in VK group `Settings -> API Usage -> Callback API -> URL`. Set ✓ in
    `Event Types -> Posts -> New`.
-   Add config in `Yandex Database -> "Bots" -> "Configs" table`
-   Press "Confirm" button in VK group Callback API settings
-   Create Telegram bot, add bot in your Telegram channel and give bot Admin rights

## Tips

### Get Telegram channel id

-   Click on [@jsondumpbot](https://t.me/jsondumpbot) or search for `JSON Dump Bot` on Telegram
-   Forward a message from that channel to the JsonDumpBot telegram bot and you should see something like this:

```
"forward_from_chat": {
    "id": -10012312312313,
    "title": "some_chat_title",
    "username": "some_username",
    "type": "channel"
}
```

### Create Telegram bot and get token

-   [@BotFather](https://t.me/BotFather)

### Where to get AWS environments for development

-   Open deployed `event-handler` function and go to Editor
