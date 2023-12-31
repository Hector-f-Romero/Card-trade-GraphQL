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

export const loginUserService = async (username: string, password: string) => {
	const queryLoginUser = `
	query Query($username: String!, $password: String!) {
		loginUser(username: $username, password: $password) {
		  user_id
		  username
		  email
		  last_reward_claimed_date
		}
	  }`;

	const result = axios.post(
		`${process.env.BACKEND_URL}/v1/graphql`,
		{
			query: queryLoginUser,
			variables: {
				username,
				password,
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

export const verifyUserExist = async (username: string, email: string) => {
	const queryverifyUsernameOrEmailExist = `
	query Query($username: String!, $email: String!) {
		verifyUsernameOrEmailExist(username: $username, email: $email) {
		  user_id
		  username
		  is_active
		}
	  }`;

	const result = axios.post(
		`${process.env.BACKEND_URL}/v1/graphql`,
		{
			query: queryverifyUsernameOrEmailExist,
			variables: {
				username,
				email,
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

export const createUserService = async (username: string, password: string, email: string) => {
	const queryCreateUser = `
	mutation Mutation($username: String!, $password: String!, $email: String!) {
		createUser(username: $username, password: $password, email: $email) {
		  user_id
		  username
		  email
		  last_reward_claimed_date
		}
	  }`;

	const result = axios.post(
		`${process.env.BACKEND_URL}/v1/graphql`,
		{
			query: queryCreateUser,
			variables: {
				username,
				password,
				email,
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
