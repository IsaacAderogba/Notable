require("dotenv").config();
const express = require("express");
const graphqlHttp = require("express-graphql");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { buildSchema } = require("graphql"); // takes template literal

const Notebook = require("./models/notebook");
const User = require("./models/user");

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

    type User {
      _id: ID!
      firstName: String!
      lastName: String!
      email: String
      password: String
    }

    input NotebookInput {
      name: String!
      createdAt: String!
    }

    input UserInput {
      firstName: String!
      lastName: String!
      email: String!
      password: String!
    }

    type RootQuery {
      notebooks: [Notebook!]!
    }

    type RootMutation {
      createNotebook(notebookInput: NotebookInput): Notebook
      createUser(userInput: UserInput): User
    }

    schema {
      query: RootQuery
      mutation: RootMutation
    }
  `),
    rootValue: {
      notebooks: async () => {
        // called when someone looks for notebooks
        const res = await Notebook.find();

        return res.map(nbList => {
          return { ...nbList._doc };
        });
      },
      createNotebook: async args => {
        const { name, createdAt } = args.notebookInput;

        // validate that user exists
        const foundUser = await User.findById("5dc52a2dbbe3a50766317ce7");
        if (!foundUser) throw new Error("User does not exist");

        // create notebook using Notebook constructor, and then write data to db
        const notebook = new Notebook({
          name,
          createdAt: new Date(createdAt),
          owner: "5dc52a2dbbe3a50766317ce7",
          authors: ["5dc52a2dbbe3a50766317ce7"]
        });
        const savedNotebook = await notebook.save();

        // For each user in authors, add to notebook list
        await foundUser.notebooks.push(notebook);
        await foundUser.save()

        // return savedNotebook
        return { ...savedNotebook._doc };
      },
      createUser: async args => {
        const { firstName, lastName, email, password } = args.userInput;

        const fndUser = await User.findOne({ email });
        if (fndUser) throw new Error("User with this email already exists");

        const hashedPW = bcrypt.hashSync(password, 12);
        const user = new User({
          firstName,
          lastName,
          email,
          password: hashedPW
        });

        const res = await user.save();
        return { ...res._doc, password: null };
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
