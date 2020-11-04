const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { makeExecutableSchema } = require("graphql-tools");
const { readFileSync } = require("fs");
const { join } = require("path");
const cors = require('cors')

const app = express();
const PORT = 6664;
const typeDefs = readFileSync(join(__dirname, "schema.graphql"), "utf8");
const resolvers = require("./resolvers");
const schema = makeExecutableSchema({ typeDefs, resolvers });
app.use(cors())
app.use(
  "/api",
  graphqlHTTP({
    schema: schema,
    rootValue: resolvers,
    graphiql: true
  })
);

app.listen(PORT, () => console.log("Server running on port: " + PORT));
