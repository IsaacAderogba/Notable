require("dotenv").config();
const express = require("express");
const graphqlHttp = require("express-graphql");
const mongoose = require("mongoose");
const { buildSchema } = require("graphql"); // takes template literal
const Notebook = require("./models/notebook");

const app = express();
app.use(express.json());

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
      notebookList: async () => {
        // called when someone looks for notebooks
        const res = await Notebook.find();

        return res.map(nbList => {
          return { ...nbList._doc };
        });
      },
      createNotebook: async args => {
        const { name, createdAt } = args.notebookInput;

        // create notebook using Notebook constructor, and then write data to db
        const notebook = new Notebook({
          name,
          createdAt: new Date(createdAt)
        });
        const res = await notebook.save();

        return { ...res._doc };
      }
    },
    graphiql: true // provides an interface
  })
);

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PW}@cluster0-eo2ax.mongodb.net/${process.env.MONGODB}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("Connected to MongoDB Atlas");
    app.listen(5000);
  })
  .catch(err => console.log("Error: ", err.message));
