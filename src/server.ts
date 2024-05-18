
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { schema } from './graphql';
import { createContext } from './context';
import config from './config';

const app = express();

app.use(express.json());

const server = new ApolloServer({
  schema,
  context: createContext,
  formatError: (err) => ({ message: err.message, status: 400 }),
});

server.start().then(() => {
  server.applyMiddleware({ app });
  app.listen({ port: config.port }, () =>
    console.log(`🚀 Server ready at http://localhost:${config.port}${server.graphqlPath}`)
  );
});
