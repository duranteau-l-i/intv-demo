# INTV-DEMO

## Description

This mini-project will show how I organize and architect my code to make it testable, maintainable and scalable.\
This mini-project will remain as small and as uncomplicated as possible to make it easy to explore.\
There is no end to it, as it will evolve according to my inspirations and what I want to show.

[Node.js](http://nodejs.org)\
Framework: [Nest](https://github.com/nestjs/nest)

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ docker-compose up -d
$ npm run start

# watch mode
$ docker-compose up -d
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test:unit

# unit tests watch mode
$ npm run test:unit:watch

# integration tests
$ docker-compose up -d
$ npm run test:integration

# e2e tests
$ docker-compose up -d
$ npm run test:e2e
```
