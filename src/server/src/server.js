const {parseCliFlagValue} = require('./utils/parse-cli-flags');
const environment = parseCliFlagValue('env');
require('dotenv').config({path: `src/environments/.env.${environment}`});

const schema = require('./graphql/schema');
const express = require('express');
const mongoose = require('mongoose');
const {ApolloServer} = require('apollo-server-express');
// imports */

const server = new ApolloServer({schema});
const app = express();

server.applyMiddleware({app});

app.get('/', function (req, res) {
    res.send(`Hello World${server.graphqlPath}${process.env.NODE_ENV}`);
})

mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true}, (error) => {
    if (error) return console.error(error);
    app.listen(process.env.PORT);
});
