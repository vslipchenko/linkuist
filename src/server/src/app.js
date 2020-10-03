// TODO post (client) data validation
const {APP_PORT, MONGODB_URI} = require('./constants/app');
// External imports
const mongoose = require('mongoose');
const express = require('express');
const {ApolloServer} = require('apollo-server-express');
// Internal imports
const schema = require('./graphql/schema');
/* Main */
const server = new ApolloServer({
    schema
});
const app = express();
// Middleware

//
server.applyMiddleware({app});
// Start app only on successful DB connection
mongoose.connect(MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true}, (error) => {
    if (error) return console.error(error);
    console.log('Port:', APP_PORT);
    app.listen(APP_PORT);
});
