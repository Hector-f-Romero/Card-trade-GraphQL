import { PrismaClient } from "@prisma/client";
import { nanoid } from "nanoid";

const prisma = new PrismaClient();

export const typeDef = `
	extend type Query {
		getInventory(id:ID!):Inventory
        getUserInventory(user_id:ID):[InventoryCard]
	}

	type Mutation{
		createInventory(user_id:ID!,card_id:ID!,amount:Int!):Inventory
        updateCardsAmount(inventory_id:ID!,amount:Int!):Inventory
        deleteInventory(inventory_id:ID!):Inventory
	}

	type Inventory {
        inventory_id:ID!
		user_id: ID!
        card_id:ID!
		amount:ID!
        created_at: String!
        updated_at: String!
        cards: Card
        users:User
	}

    type InventoryCard{
        card_id:ID!
        name:String!
        description:String!
        value:Int!
        rarity:String!
        amount:Int!
    }
`;

export const resolvers = {
	Query: {
		getInventory: async (_: unknown, args: { id: string }) => {
			const inventory = await prisma.inventories.findUnique({
				where: {
					inventory_id: args.id,
				},
				include: {
					cards: true,
					users: true,
				},
			});
			console.log(inventory);
			return inventory;
		},
		getUserInventory: async (_: unknown, args: { user_id: string }) => {
			const { user_id } = args;
			const result =
				await prisma.$queryRaw`SELECT c.card_id,i.amount,c.name,c.description,c.value,r.name "rarity" 
            FROM inventories as i INNER JOIN cards as c ON i.card_id = c.card_id
            INNER JOIN rarities as r ON c.rarity=r.rarity_id WHERE user_id=${user_id};`;
			console.log(result);
			return result;
		},
	},
	Mutation: {
		createInventory: async (_: unknown, args: { user_id: string; card_id: string; amount: number }) => {
			const { user_id, card_id, amount } = args;

			const newInventory = await prisma.inventories.create({
				data: {
					inventory_id: nanoid(15),
					user_id,
					card_id,
					amount,
				},
			});

			return newInventory;
		},
		updateCardsAmount: async (_: unknown, args: { inventory_id: string; amount: number }) => {
			const { inventory_id, amount } = args;
			const updatedInventory = await prisma.inventories.update({
				where: {
					inventory_id,
				},
				data: {
					amount,
				},
			});
			console.log(updatedInventory);
			return updatedInventory;
		},
		deleteInventory: async (_: unknown, args: { inventory_id: string }) => {
			const { inventory_id } = args;
			const deletedInventory = await prisma.inventories.delete({
				where: {
					inventory_id,
				},
			});
			return deletedInventory;
		},
	},
};
