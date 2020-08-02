// imports
const schema = require('./graphql/schema');
const express = require('express');
const mongoose = require('mongoose');
const {ApolloServer} = require('apollo-server-express');
//

const server = new ApolloServer({schema});
const app = express();

server.applyMiddleware({app});

// app.get('/', function (req, res) {
//     res.send(`Hello World${server.graphqlPath}`);
// })

mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true}, (error) => {
    if (error) return console.error(error);
    app.listen(process.env.PORT);
});
