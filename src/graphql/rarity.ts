import { PrismaClient } from "@prisma/client";
import { nanoid } from "nanoid";

const prisma = new PrismaClient();

export const typeDef = `
	extend type Query {
		getRarities: [Rarity]
		getRarity(id:ID!):Rarity
	}

	type Mutation{
		createRarity(name:String!):Rarity
		updateRarity(id:ID!,name:String!):Rarity
		deleteRarity(id:ID!):Rarity
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
		getRarities: async () => {
			try {
				const rarities = await prisma.rarities.findMany();
				return rarities;
			} catch (error) {
				console.log(error);
			}
		},
		getRarity: async (_: unknown, args: { id: string }) => {
			try {
				console.log(args);
				const rarity = await prisma.rarities.findUnique({
					where: {
						rarity_id: args.id,
					},
				});
				return rarity;
			} catch (error) {
				console.log(error);
			}
		},
	},
	Mutation: {
		createRarity: async (_: unknown, args: { name: string }) => {
			try {
				const { name } = args;
				const newRarity = await prisma.rarities.create({
					data: {
						rarity_id: nanoid(10),
						name,
					},
				});
				return newRarity;
			} catch (error) {
				console.log(error);
			}
		},
		updateRarity: async (_: unknown, args: { id: string; name: string }) => {
			try {
				const { id, name } = args;
				const updatedRarity = await prisma.rarities.update({
					where: {
						rarity_id: id,
					},
					data: {
						name,
					},
				});
				console.log(updatedRarity);
				return updatedRarity;
			} catch (error) {
				console.log(error);
			}
		},
		deleteRarity: async (_: unknown, args: { id: string; name: string }) => {
			try {
				const deletedRarity = await prisma.rarities.delete({
					where: {
						rarity_id: args.id,
					},
				});
				console.log(deletedRarity);
				return deletedRarity;
			} catch (error) {
				console.log(error);
			}
		},
	},
};
