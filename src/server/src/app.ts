import schema from './graphql/schema';
import {APP_PORT, MONGODB_URI} from './constants/app';
import {ApolloServerExpressConfig, ExpressContext} from 'apollo-server-express/dist/ApolloServer';
import mongoose from 'mongoose';
import express from 'express';
import {ApolloServer} from 'apollo-server-express';

/* Main */
const server = new ApolloServer({
  schema,
  context: ({req}: ExpressContext) => {
    // 'context' is a third argument of a resolver function
    // Note! This example uses the `req` object to access headers,
    // but the arguments received by `context` vary by integration.
    // This means they will vary for Express, Koa, Lambda, etc.!
    //
    // To find out the correct arguments for a specific integration,
    // see the `context` option in the API reference for `apollo-server`:
    // https://www.apollographql.com/docs/apollo-server/api/apollo-server/

    // Get the Bearer token from the authorization header
    const authorizationHeader = req.headers.authorization;

    if (authorizationHeader) {
      const needle = 'Bearer ';
      const bearerAt = authorizationHeader.indexOf(needle);
      // const spaceAfterTokenAt = authorizationHeader.indexOf(' ', needle.length);
      const accessToken = authorizationHeader.slice(
        bearerAt + needle.length,
        // spaceAfterTokenAt > -1 ? spaceAfterTokenAt : authorizationHeader.length
        authorizationHeader.length,
      );
      // console.log('ACCESS TOKEN IS ', accessToken);
      if (accessToken) {
        return {accessToken};
      }
    }
  },
} as ApolloServerExpressConfig);
const app = express();
// Middleware
//
server.applyMiddleware({app});
// Start app only on successful DB connection
mongoose.set('debug', true);
mongoose
  .connect(MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
  .then(() => {
    console.log('Port:', APP_PORT);
    app.listen(APP_PORT);
  })
  .catch((error) => console.log(error));
