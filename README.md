
Run following commands:
```
$ npm install
$ npm run build
```

Update the `./config/index.js` in the root folder of the app. Provide your mongo connect url. Cookie key can be set to a random string.

```
module.exports = {
    mongoURI: '<connection string to your mongo db>',
    cookieKey: '<Your cookie session secret>',
    catApiKey: '<Your cat api key>',
}
```

Run the app with
```
$ npm start
```

Open your browser on url `http://localhost:5000/`
