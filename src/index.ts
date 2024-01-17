import { createServer } from "http";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";

import cors from "cors";
import express from "express";
import "dotenv/config";

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";

import { schema } from "./graphql/schema.js";
import { graphQLHandleErrors } from "./helpers/handleErrors.js";

const app = express();
const PORT = process.env.PORT || 4000;
const httpServer = createServer(app);

// Creating the WebSocket server
const wsServer = new WebSocketServer({
	server: httpServer,
	// Pass a different path here if app.use
	// serves expressMiddleware at a different path
	path: "/v1/graphql",
});

// Hand in the schema we just created and have the WebSocketServer start listening.
const serverCleanup = useServer({ schema }, wsServer);

const server = new ApolloServer({
	schema: schema,
	formatError: graphQLHandleErrors,
	plugins: [
		// Proper shutdown for the HTTP server.
		ApolloServerPluginDrainHttpServer({ httpServer }),

		// Proper shutdown for the WebSocket server.
		{
			async serverWillStart() {
				return {
					async drainServer() {
						await serverCleanup.dispose();
					},
				};
			},
		},
	],
});

await server.start();

app.use(cors());
app.use(express.json());
app.use("/v1/graphql", cors(), express.json(), expressMiddleware(server));

// start the Express server
httpServer.listen(PORT, () => {
	console.log(`Server is running on port: ${PORT}`);
});
