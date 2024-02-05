import { WebSocket, WebSocketServer } from "ws";
import { IncomingMessage, Server } from "http";

export const initializeWebSocketServer = (httpServer: Server) => {
	// Creating the WebSocket server
	const wsServer = new WebSocketServer({
		server: httpServer,
		path: "/v1/trades",
	});

	// This variable will storage the room ID and array for websockets
	const tradeRoomsSocketsManager = new Map<string, WebSocket[]>();

	wsServer.on("connection", (socket, request) => {
		// console.log(`Hola, se conectó por socket ${request.socket.remoteAddress}`);
		const tradeRoomID = getRoomIDParams(request);

		if (!tradeRoomID) {
			console.log("No existe id");
			socket.send(JSON.stringify({ error: "Trade room null" }));
			socket.close();
			return;
		}

		// Get the tradeRoom from the Map structure
		const tradeRoom = tradeRoomsSocketsManager.get(tradeRoomID);

		// If don't exist trade room, add to Map
		if (!tradeRoom) {
			// Add new Trade rooms with the current client.
			tradeRoomsSocketsManager.set(tradeRoomID, [socket]);
		} else {
			// If the trade room already exist, add the new socket to that room
			tradeRoom.push(socket);
		}

		socket.on("message", (message) => {
			// Decode the message if the body is a JSON
			// TODO: validate if message.toString() can fail.
			const data = JSON.parse(message.toString());
			console.log(data);
		});
	});
};

const getRoomIDParams = (request: IncomingMessage) => {
	// It's necessary to define the second parameter as `http://${request.headers.host}`
	const url = new URL(request.url as string, `http://${request.headers.host}`);
	const tradeRoomID = url.searchParams.get("roomID");

	return !tradeRoomID ? null : tradeRoomID;
};

const countClients = (tradeRoomsSocketsManager: Map<string, WebSocket[]>) => {
	tradeRoomsSocketsManager.forEach((trade) => {
		trade.forEach((client, index) => {
			console.log(`Existe cliente ${index + 1}`);
		});
		console.log("-------------");
	});
};
