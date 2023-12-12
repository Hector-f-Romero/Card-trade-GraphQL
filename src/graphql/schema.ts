import { makeExecutableSchema } from "@graphql-tools/schema";
import { mergeTypeDefs, mergeResolvers } from "@graphql-tools/merge";

import { typeDef as Card, resolvers as cardResolvers } from "./card.js";
import { typeDef as Rarity, resolvers as rarityResolvers } from "./rarity.js";
import { typeDef as User, resolvers as userResolvers } from "./user.js";

const Query = `
	type Query {
		_empty: String
	}
`;

export const schema = makeExecutableSchema({
	typeDefs: mergeTypeDefs([Query, Card, Rarity, User]),
	resolvers: mergeResolvers([cardResolvers, rarityResolvers, userResolvers]),
});
