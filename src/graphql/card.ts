import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const typeDef = `
	extend type Query {
		cards: [Card]
	}

	type Card {
		card_id: ID!
		name: String!
		description: String!
		value: Int!
		rarity: Rarity!
		created_at: String!
		updated_at: String!
	}
`;

export const resolvers = {
	Query: {
		cards: async () => {
			try {
				const cards = await prisma.cards.findMany();
				return cards;
			} catch (error) {
				console.log(error);
			}
		},
	},
};
