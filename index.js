const express = require("express");
const graphqlHttp = require("express-graphql");
const { buildSchema } = require("graphql"); // takes template literal

const app = express();
app.use(express.json());

const notebookList = [
  { _id: 1, name: "SQL", createdAt: "2019-11-07T18:55:46.746Z" }
];

// use graphqlHttp to build schema and root queries/mutations
app.use(
  "/graphql",
  graphqlHttp({
    schema: buildSchema(`
    type Notebook {
      _id: ID!
      name: String!
      createdAt: String!
    }

    input NotebookInput {
      name: String!
      createdAt: String!
    }

    type RootQuery {
      notebookList: [Notebook!]!
    }

    type RootMutation {
      createNotebook(notebookInput: NotebookInput): Notebook
    }

    schema {
      query: RootQuery
      mutation: RootMutation
    }
  `),
    rootValue: {
      notebookList: () => {
        // called when someone looks for notebooks
        return notebookList;
      },
      createNotebook: args => {
        const { name, createdAt } = args.notebookInput;

        const notebook = {
          _id: Math.random().toString(),
          name,
          createdAt
        };

        notebookList.push(notebook);

        return notebook;
      }
    },
    graphiql: true // provides an interface
  })
);

app.listen(5000);
