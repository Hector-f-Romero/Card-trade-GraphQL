import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const typeDef = `
	extend type Query {
		rarities: [Rarity]
	}

	type Rarity {
        rarity_id: ID!
        name: String!
        created_at: String!
        updated_at: String!
    }
    
`;

export const resolvers = {
	Query: {
		rarities: async () => {
			try {
				const rarities = await prisma.rarities.findMany();
				return rarities;
			} catch (error) {
				console.log(error);
			}
		},
	},
};
