import { createServer } from "http";

import cors from "cors";
import express from "express";
import "dotenv/config";

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { schema } from "./graphql/schema.js";
import { graphQLHandleErrors } from "./helpers/handleErrors.js";
import { initializeWebSocketServer } from "./sockets/socketServer.js";

const app = express();
const PORT = process.env.PORT || 4000;
const httpServer = createServer(app);

initializeWebSocketServer(httpServer);

const server = new ApolloServer({
	schema: schema,
	formatError: graphQLHandleErrors,
});

await server.start();

app.use(cors());
app.use(express.json());
app.use("/v1/graphql", cors(), express.json(), expressMiddleware(server));

// start the Express server
httpServer.listen(PORT, () => {
	console.log(`Server is running on port: ${PORT}`);
});
