export const typeDef = `
	extend type Query {
		cards: [Card]
	}

	type Card {
		card_id: ID!
		name: String!
		description: String!
		value: Int!
		rarity: String!
		created_at: String!
		updated_at: String!
	}
`;

export const resolvers = {
	Query: {
		cards: () => [
			{
				card_id: 1,
				name: "Test 1",
				description:
					"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi fringilla posuere mollis. Quisque vitae velit non lorem dapibus fringilla eget nec augue",
				value: 10,
				rarity: "Epic",
				created_at: "7/12/2023",
			},
			{
				card_id: 2,
				name: "Test 2",
				description:
					"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi fringilla posuere mollis. Quisque vitae velit non lorem dapibus fringilla eget nec augue",
				value: 10,
				rarity: "Common",
				created_at: "6/12/2023",
			},
		],
	},
};
