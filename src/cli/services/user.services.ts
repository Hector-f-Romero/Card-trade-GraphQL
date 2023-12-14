import axios from "axios";
import "dotenv/config";

export const getInventoryUser = async (user_id: string) => {
	const queryInventoryUser = `
    query GetUserInventory($userId: ID) {
        getUserInventory(user_id: $userId) {
          card_id
          name
          value
          amount
          rarity
        }
      }
    `;

	const result = await axios.post(
		`${process.env.BACKEND_URL}/v1/graphql`,
		{
			query: queryInventoryUser,
			variables: {
				userId: user_id,
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
