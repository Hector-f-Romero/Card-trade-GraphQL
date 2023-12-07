import { makeExecutableSchema } from "@graphql-tools/schema";
import { mergeTypeDefs, mergeResolvers } from "@graphql-tools/merge";

import { typeDef as Card, resolvers as cardResolvers } from "./card.js";

const Query = `
	type Query {
		_empty: String
	}
`;

export const schema = makeExecutableSchema({
	typeDefs: mergeTypeDefs([Query, Card]),
	resolvers: mergeResolvers(cardResolvers),
});
