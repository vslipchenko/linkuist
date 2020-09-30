const {parseCliFlagValue} = require('./utilities/parse-cli-flags');
const environment = parseCliFlagValue('env');
// Include dev or prod env variables file dynamically
require('dotenv').config({path: `src/environments/.env.${environment}`});
// External imports
const mongoose = require('mongoose');
const express = require('express');
const {ApolloServer} = require('apollo-server-express');
const passport = require('passport');
// Internal imports
const schema = require('./graphql/schema');
const passportConfigurationInit = require('./configurations/passport');
// Readonly members
const {
    APP_PORT,
    MONGODB_URI
} = process.env;
/* Main */
const server = new ApolloServer({schema});
const app = express();
// Passport middleware
passportConfigurationInit();
app.use(passport.initialize({}));
app.use(passport.session({}));
//
server.applyMiddleware({app});
// Start app only on successful DB connection
mongoose.connect(MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true}, (error) => {
    if (error) return console.error(error);
    app.listen(APP_PORT);
});
