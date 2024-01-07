import { PrismaClient } from "@prisma/client";
import { nanoid, random } from "nanoid";
import { CardInventory, InventoryRecord } from "../shared.types.js";

const prisma = new PrismaClient();

export const typeDef = `
	extend type Query {
		getCards: [Card]
		getCard(id:ID!):Card
		getRandomCards(user_id:ID!):[InventoryCard]
	}

	type Mutation{
		createCard(name:String!,description:String!,value:Int!,rarity:ID!):Card
		updateCard(id:ID!,name:String,description:String,value:Int,rarity:ID):Card
		deleteCard(id:ID!):Card
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
		getCards: async () => {
			// Obtain all the cards in DB with rarity information in the field "rarities". This can be a problem in GraphQL client.
			// There still not way to put alias in "include" clause in Prisma 5.7.0".
			const cards = await prisma.cards.findMany({
				include: {
					rarities: true,
				},
			});
			// To return rarity data in the key "rarity", I need to use a .map() and destructuring "rarities" key and assing it in "rarity".
			const formattedCards = cards.map(({ rarities, ...card }) => {
				return { ...card, rarity: rarities };
			});

			return formattedCards;
		},
		getCard: async (_: unknown, args: { id: string }) => {
			// Obtain all the cards in DB with rarity information in the field "rarities".
			// There still not way to put alias in "include" clause in Prisma 5.7.0".
			const card = await prisma.cards.findUnique({
				where: {
					card_id: args.id,
				},
				include: {
					rarities: true,
				},
			});

			// Put the "rarities" field data in "rarity" key in another object to avoid problems with GraphQL client.
			const formattedCard = {
				card_id: card?.card_id,
				name: card?.name,
				description: card?.description,
				value: card?.value,
				rarity: card?.rarities,
				created_at: card?.created_at,
				updated_at: card?.updated_at,
			};
			return formattedCard;
		},
		getRandomCards: async (_: unknown, args: { user_id: string }) => {
			// This query return 5 cards with an ranom amount of cards (1-3)
			const randomCards: CardInventory[] =
				await prisma.$queryRaw`SELECT c.card_id,c.name,c.description,c.value,r.name as rarity,
				'1' as amount FROM cards as c
				INNER JOIN rarities as r ON c.rarity = r.rarity_id ORDER BY RAND() LIMIT 5;`;

			// 1. Obtain all the cards that user has
			const userInventoryCards: { inventory_id: string; card_id: string; amount: number }[] =
				await prisma.inventories.findMany({
					where: {
						user_id: "cmXjNMgbsA",
					},
					select: {
						inventory_id: true,
						card_id: true,
						amount: true,
					},
				});

			// 2. If the user doesn't have any card in his/her inventory, insert all random cards.
			if (userInventoryCards.length === 0) {
				randomCards.forEach(async (card) => {
					await prisma.inventories.create({
						data: {
							inventory_id: nanoid(15),
							user_id: args.user_id,
							card_id: card.card_id,
							amount: 1,
						},
					});
				});

				// Update last Reward Claimed Date in DB
				await prisma.users.update({
					data: {
						last_reward_claimed_date: new Date(),
					},
					where: {
						user_id: args.user_id,
					},
				});

				return randomCards;
			}

			const uniqueCards: InventoryRecord[] = [];
			const repeatedCards: InventoryRecord[] = [];

			// 3. Check if cards are repeated or new for his/her inventory.
			randomCards.forEach((card) => {
				const existInInventory = userInventoryCards.find((inventory) => inventory.card_id === card.card_id);
				if (existInInventory) {
					repeatedCards.push({
						inventory_id: existInInventory.inventory_id,
						user_id: args.user_id,
						card_id: card.card_id,
						amount: Number(existInInventory.amount) + 1,
					});
				} else {
					uniqueCards.push({
						inventory_id: nanoid(15),
						user_id: args.user_id,
						card_id: card.card_id,
						amount: 1,
					});
				}
			});

			// 4. If the user don't have repeated cards, create new inventory rows for all the cards.
			if (repeatedCards.length === 0) {
				const result = await prisma.inventories.createMany({
					data: uniqueCards,
				});

				// Update last Reward Claimed Date in DB
				await prisma.users.update({
					data: {
						last_reward_claimed_date: new Date(),
					},
					where: {
						user_id: args.user_id,
					},
				});

				return randomCards;
			} else {
				// Insert the new cards if exist new cards
				if (uniqueCards.length !== 0) {
					await prisma.inventories.createMany({ data: uniqueCards });
				}
				// Update multiple existing cards.
				await prisma.$transaction(
					repeatedCards.map((cardUpdated) =>
						prisma.inventories.update({
							where: {
								inventory_id: cardUpdated.inventory_id,
							},
							data: {
								amount: cardUpdated.amount,
							},
						})
					)
				);

				// Update last Reward Claimed Date in DB
				await prisma.users.update({
					data: {
						last_reward_claimed_date: new Date(),
					},
					where: {
						user_id: args.user_id,
					},
				});

				return randomCards;
			}
		},
	},
	Mutation: {
		createCard: async (_: unknown, args: { name: string; description: string; value: number; rarity: string }) => {
			const { name, description, rarity, value } = args;
			const newCard = await prisma.cards.create({
				data: {
					card_id: nanoid(10),
					name,
					description,
					value,
					rarity,
				},
			});
			return newCard;
		},
		updateCard: async (
			_: unknown,
			args: { id: string; name: string; description: string; value: number; rarity: string }
		) => {
			const { id, name, description, rarity, value } = args;
			const updatedCard = await prisma.cards.update({
				where: {
					card_id: id,
				},
				include: {
					rarities: true,
				},
				data: {
					name,
					description,
					value,
					rarity,
				},
			});
			// Put the "rarities" field data in "rarity" key in another object to avoid problems with GraphQL client.
			const formattedCard = {
				card_id: updatedCard?.card_id,
				name: updatedCard?.name,
				description: updatedCard?.description,
				value: updatedCard?.value,
				rarity: updatedCard?.rarities,
				created_at: updatedCard?.created_at,
				updated_at: updatedCard?.updated_at,
			};
			return formattedCard;
		},
		deleteCard: async (_: unknown, args: { id: string }) => {
			const deletedCard = await prisma.cards.delete({
				where: {
					card_id: args.id,
				},
				include: {
					rarities: true,
				},
			});

			// Put the "rarities" field data in "rarity" key in another object to avoid problems with GraphQL client.
			const formattedCard = {
				card_id: deletedCard?.card_id,
				name: deletedCard?.name,
				description: deletedCard?.description,
				value: deletedCard?.value,
				rarity: deletedCard?.rarities,
				created_at: deletedCard?.created_at,
				updated_at: deletedCard?.updated_at,
			};
			return formattedCard;
		},
	},
};
