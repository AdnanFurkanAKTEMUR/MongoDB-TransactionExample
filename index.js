const { ApolloServer } = require("apollo-server-express");
const cors = require("cors");
const express = require("express");
const client = require("./db/mongo.js");
const schema = require("./graphql/schema");

(async function () {
  const app = express();

  const corsOptions = {
    origin: true,
    credentials: true,
  };
  app.use(cors(corsOptions));

  const apolloServer = new ApolloServer({
    schema: schema,
    context: ({ req, res }) => ({
      req,
      res,
      client:client
    })
  });

  await apolloServer.start();
  console.log("apollo server started");

  apolloServer.applyMiddleware({ app, path: "/", cors: false });
  console.log("middle ware apllied succesfuly");

  app.listen({ port: 4000 }, () => {
    console.log("server is ready on port 4000");
  });
})();