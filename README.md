# Sjakk Arena


## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

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
To run all cypress tests that does not contain .skip use. 
Some of the tests require the backend to be up and running and some are "mocking/stubbing" the requests.
```
cypress run
```
Cypress also have a GUI you can use to run specific test files and see the test live.
```
cypress open
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
