import { nanoid } from "nanoid";
import { User, UserRoom } from "../types/user.type.js";
import { PubSub } from "graphql-subscriptions";
import { SubscriptionNames } from "../types/events.type.js";
import { TradeRoomManager, TradeRoomStates } from "../models/TradeRoom.js";

const pubsub = new PubSub();

const tradeRoomManager = TradeRoomManager.getInstance();

export const typeDef = `
	extend type Query {
		getTradeRoom(room_id:ID!): String!
	}

	type Mutation{
		createTradeRoom(host:UserRoomInput!):TradeRoom!
		joinTradeRoom(room_id:String!,user:UserRoomInput!):TradeRoom!
		deleteTradeRoom(room_id:String!):TradeRoom
	}

	type Subscription {
		joinToRoom(room_id: ID!): TradeRoom
	}

	input UserRoomInput {
        user_id: String!
        username: String!
    }

	type TradeRoom {
        room_id: String!
        users: [UserRoom]
		status: String
    }

    type UserRoom {
        user_id: ID!
        username: String!
    }

    type ResponseTrade{
		canConnect: Boolean!
	}
`;

export const resolvers = {
	Query: {
		getTradeRoom: async (_: unknown, args: { room_id: string }) => {
			console.log("Obteniendo room");
			console.log(args.room_id);
			const users = [{ user_id: "test1" }];
			return "Hola";
		},
	},
	Mutation: {
		createTradeRoom: async (_: unknown, args: { host: UserRoom }) => {
			const roomID = nanoid(8);
			tradeRoomManager.tradeRooms.push({
				room_id: roomID,
				users: [args.host],
				status: TradeRoomStates.AVAILABLE,
			});

			const newTradeRoom = tradeRoomManager.tradeRooms[tradeRoomManager.tradeRooms.length - 1];
			return newTradeRoom;
		},
		joinTradeRoom: async (_: unknown, args: { user: UserRoom; room_id: string }) => {
			// Verify if the trade room exist
			const tradeRoomIndex = tradeRoomManager.tradeRooms.findIndex((room) => room.room_id === args.room_id);

			// The property args.user is received like [Object: null prototype]. I intuit this occur thanks to Apollo Server
			// For avoid the [Object: null prototype], I use Object.assign()
			const formattedUser = Object.assign({}, args.user);

			if (tradeRoomIndex === -1) {
				// TODO: handle errors
				return new Error("Trade doesn't exist.");
			}
			// Add the new user to the room
			tradeRoomManager.tradeRooms[tradeRoomIndex].users.push(formattedUser);
			// Get the new users in the room
			const newUsers = tradeRoomManager.tradeRooms[tradeRoomIndex].users;

			pubsub.publish(`ROOM_${args.room_id}`, {
				joinToRoom: {
					room_id: args.room_id,
					users: newUsers,
				},
			});

			console.log(tradeRoomManager.tradeRooms[tradeRoomIndex]);
			return tradeRoomManager.tradeRooms[tradeRoomIndex];
		},
		deleteTradeRoom: async (_: unknown, args: { room_id: string }) => {
			// Obtain index of element that I want remove
			const roomIndex = tradeRoomManager.tradeRooms.findIndex((room) => room.room_id === args.room_id);
			// Delete a single room according to found index
			const removedRoom = tradeRoomManager.tradeRooms.splice(roomIndex, 1);
			return removedRoom;
		},
	},
	Subscription: {
		joinToRoom: {
			// Subscribe to event "ROOM_[room_id]"
			subscribe: (_: unknown, args: { room_id: string }) => pubsub.asyncIterator([`ROOM_${args.room_id}`]),
		},
	},
};
