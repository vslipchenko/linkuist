// TODO post (client) data validation
const {APP_PORT, MONGODB_URI} = require('./constants/app');
// External imports
const mongoose = require('mongoose');
const express = require('express');
const {ApolloServer} = require('apollo-server-express');
// Internal imports
const schema = require('./graphql/schema');
//
import {ApolloServerExpressConfig} from "apollo-server-express/dist/ApolloServer";
/* Main */
const server = new ApolloServer(<ApolloServerExpressConfig>{
    schema,
    context: ({ req: request }) => {
        // Note! This example uses the `req` object to access headers,
        // but the arguments received by `context` vary by integration.
        // This means they will vary for Express, Koa, Lambda, etc.!
        //
        // To find out the correct arguments for a specific integration,
        // see the `context` option in the API reference for `apollo-server`:
        // https://www.apollographql.com/docs/apollo-server/api/apollo-server/

        // Get the user token from the headers.
        const accessToken = request.headers.authorization;

        if (accessToken) {
            return {accessToken};
        }
    }
});
const app = express();
// Middleware

//
server.applyMiddleware({app});
// Start app only on successful DB connection
mongoose.connect(MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true}, (error: unknown) => {
    if (error) return console.error(error);
    console.log('Port:', APP_PORT);
    app.listen(APP_PORT);
});
