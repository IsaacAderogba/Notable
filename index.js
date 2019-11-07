const express = require("express");
const graphqlHttp = require("express-graphql");
const { buildSchema } = require("graphql"); // takes template literal

const app = express();
app.use(express.json())

// use graphqlHttp to build schema and root queries/mutations
app.use("/graphql", graphqlHttp({
  schema: buildSchema(`
    type RootQuery {
      notebooks: [String!]!
    }

    type RootMutation {
      createNotebook(name: String): String
    }

    schema {
      query: RootQuery
      mutation: RootMutation
    }
  `),
  rootValue: {}, // points at resolvers
  graphiql: true // provides an interface
}))

app.listen(5000)