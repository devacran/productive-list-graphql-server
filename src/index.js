const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { makeExecutableSchema } = require("graphql-tools");
const { readFileSync } = require("fs");
const { join } = require("path");

const PORT = 6664;
const isDev = process.env.NODE_ENV === "development";

const cors = require("cors");
const app = express();
const typeDefs = readFileSync(join(__dirname, "schema.graphql"), "utf8");
const resolvers = require("./resolvers");
const schema = makeExecutableSchema({ typeDefs, resolvers });

app.use(cors());
app.use(
  "/api",
  graphqlHTTP({
    schema: schema,
    rootValue: resolvers,
    graphiql: isDev
  })
);

app.listen(PORT, () => console.log("Server running on port: " + PORT));
