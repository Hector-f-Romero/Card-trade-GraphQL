import { makeExecutableSchema } from "@graphql-tools/schema";
import { mergeTypeDefs, mergeResolvers } from "@graphql-tools/merge";

import { typeDef as Card, resolvers as cardResolvers } from "./card.js";
import { typeDef as Rarity, resolvers as rarityResolvers } from "./rarity.js";
import { typeDef as User, resolvers as userResolvers } from "./user.js";
import { typeDef as Inventory, resolvers as inventoryResolvers } from "./inventory.js";
import { typeDef as TradeRoom, resolvers as tradeRoomResolvers } from "./tradeRoom.js";

const Query = `
	type Query {
		_empty: String
	}
`;

export const schema = makeExecutableSchema({
	typeDefs: mergeTypeDefs([Query, Card, Rarity, User, Inventory, TradeRoom]),
	resolvers: mergeResolvers([cardResolvers, rarityResolvers, userResolvers, inventoryResolvers, tradeRoomResolvers]),
});
