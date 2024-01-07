import cors from "cors";
import express from "express";
import "dotenv/config";

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";

import { schema } from "./graphql/schema.js";
import { graphQLHandleErrors } from "./helpers/handleErrors.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const server = new ApolloServer({
	schema: schema,
	formatError: graphQLHandleErrors,
});

await server.start();

app.use("/v1/graphql", cors(), express.json(), expressMiddleware(server));

// start the Express server
app.listen(PORT, () => {
	console.log(`Server is running on port: ${PORT}`);
});
