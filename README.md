# RugbyLive

## TelegramBot

@rugby_live_bot

## API

https://english.api.rakuten.net/sportcontentapi/api/rugby-live-data

## Firebase

https://console.firebase.google.com/

## Cloud Run

https://console.cloud.google.com/run

## Cloud Scheduler

https://console.cloud.google.com/cloudscheduler

## .env

```shell
TOKEN_TELEGRAM=
TOKEN_RUGBY_API=
# unnecessary on GCP
GOOGLE_APPLICATION_CREDENTIALS=  
```

## routes

```http request
GET /
GET /test?id=80980
POST /1844c16378ad1aacf0a39a72b2423f29
```

## How to set up github workflow?

* [CI/CD Cloud Run Github Actions](https://cloud.google.com/community/tutorials/cicd-cloud-run-github-actions) - outdated but still useful
* [Steps to setup GCP](https://github.com/google-github-actions/deploy-cloudrun#setup)
