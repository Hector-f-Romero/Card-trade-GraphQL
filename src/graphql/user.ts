import { PrismaClient } from "@prisma/client";
import { nanoid } from "nanoid";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const typeDef = `
	extend type Query {
		getUsers: [User]
		getUser(id:ID!):User
	}

	type Mutation{
		createUser(username:String!,password:String!,email:String!):User
		updateUser(id:ID!,username:String,password:String,email:String,last_reward_claimed_date:String,is_active:Boolean):User
		deleteUser(id:ID!):User
	}

	type User {
		user_id: ID!
		username: String!
		password: String!
		email: String!
		last_reward_claimed_date: String
		is_active: Boolean!
        created_at: String!
        updated_at: String!
	}
`;

export const resolvers = {
	Query: {
		getUsers: async () => {
			const users = await prisma.users.findMany();
			return users;
		},
		getUser: async (_: unknown, args: { id: string }) => {
			const user = await prisma.users.findUnique({
				where: {
					user_id: args.id,
				},
			});
			return user;
		},
	},
	Mutation: {
		createUser: async (_: unknown, args: { username: string; password: string; email: string }) => {
			const { username, password, email } = args;

			const salt = bcrypt.genSaltSync(12);
			const hashedPassword = bcrypt.hashSync(password, salt);

			const newUser = await prisma.users.create({
				data: {
					user_id: nanoid(10),
					username,
					password: hashedPassword,
					email,
				},
			});

			return newUser;
		},
		updateUser: async (
			_: unknown,
			args: {
				id: string;
				username: string;
				email: string;
				last_reward_claimed_date: string;
				is_active: boolean;
			}
		) => {
			const { id, username, email, last_reward_claimed_date, is_active } = args;

			// This resolver will not change the password, cause I prefer make a specific resolver for that action.
			// TODO: resolver to change password.
			const updatedUser = await prisma.users.update({
				where: {
					user_id: id,
				},
				data: {
					username,
					email,
					last_reward_claimed_date,
					is_active,
				},
			});

			return updatedUser;
		},
		deleteUser: async (_: unknown, args: { id: string }) => {
			// For users has been implemented a soft delete for preserve the email accounts registered.
			const deleteUser = await prisma.users.update({
				where: {
					user_id: args.id,
				},
				data: {
					is_active: false,
				},
			});

			return deleteUser;
		},
	},
};
