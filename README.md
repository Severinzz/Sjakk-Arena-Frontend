# Sjakk Arena
To test the app you can visit https://sjakk-arena.herokuapp.com/ or follow the instructions below.
The website is deployed with the [heroku branch](https://github.com/Severinzz/Sjakk-Arena-Frontend/tree/feat/heroku)

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```
Application wil be served to [http://localhost:8081/](http://localhost:8081/).


### Compiles and minifies for production
```
npm run build
```


### Testing
#### Unit tests
```
npm run test:unit
```
#### Cypres
To run all [cypress](https://www.cypress.io/) tests that does not contain .skip use. This command also records the test
runs and takes a screenshot if a test was to fail.
```
cypress run
```
Cypress also have a GUI you can use to run specific tests files and see the test live.
```
cypress open
```
Some of the tests require the [backend](https://github.com/Severinzz/Sjakk-Arena-backend) to be up and running 
and some tests have the network requests "mocked/stubbed". Some of the tests also requires the dummy data defined in the 
backend to be in that exact state.

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
