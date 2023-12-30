import axios from "axios";
import "dotenv/config";

export const getRandomCardsService = async (user_id: string) => {
	const queryGetRandomCards = `
    query GetRandomCards($user_id: ID!) {
		getRandomCards(user_id: $user_id) {
		  card_id
		  name
		  value
		  amount
		  description
		  rarity
		}
	  }
    `;

	const result = await axios.post(
		`${process.env.BACKEND_URL}/v1/graphql`,
		{
			query: queryGetRandomCards,
			variables: {
				user_id,
			},
		},
		{
			headers: {
				"Content-Type": "application/json",
			},
		}
	);
	return result;
};
