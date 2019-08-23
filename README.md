[![Build Status](https://travis-ci.com/macphilips/sms-api.svg?branch=develop)](https://travis-ci.com/macphilips/sms-api)

## SMS-Management-Application-API
An application that manages SMS application API.

##  Documentation
The API documentation can be found here: http://localhost:8080/docs/api


## Technologies Used
- Node/Expressjs
- database: Postgresql

## Features
- Link message to sender and receiver
- create new contact
- Delete contact and all messages they sent and received
- List all contact and messages

## To Install
- Download or clone the repo
- open terminal inside root directory of cloned folder
- type `npm install` to install all dependencies
- type `npm run db:rollmigrate` run migrations
- add a env file amd add the database url and type check env.sample for example
- `npm run start:dev` to run in development mode
- `npm run start` to run in production mode
- `npm run test` to run in production mode

