import path from "path";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";

import cors from "cors";
import express from "express";
import gql from "graphql-tag";
import "dotenv/config";

import { ApolloServer } from "@apollo/server";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { expressMiddleware } from "@apollo/server/express4";

import { resolvers } from "./graphql/resolvers.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const typeDefs = gql(
	readFileSync(path.join(__dirname, "./graphql/schema.graphql"), {
		encoding: "utf-8",
	})
);

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
	schema: buildSubgraphSchema({ typeDefs, resolvers }),
});

await server.start();

app.use("/graphql", cors(), express.json(), expressMiddleware(server));

// start the Express server
app.listen(PORT, () => {
	console.log(`Server is running on port: ${PORT}`);
});
