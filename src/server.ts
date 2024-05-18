
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { schema } from './graphql';
import { createContext } from './context';
import config from './config';
import path from 'path';
import expressPlayground from 'graphql-playground-middleware-express';

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

const server = new ApolloServer({
  schema,
  context: createContext,
  formatError: (err) => ({ message: err.message, status: 400 }),
  introspection: true
});


server.start().then(() => {
  server.applyMiddleware({
    app
  });

  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  });


  app.get('/playground', expressPlayground({ endpoint: '/graphql' }));
  app.listen({ port: config.port }, () =>
    console.log(`🚀 Server ready at http://localhost:${config.port}${server.graphqlPath}`)
  );
});
