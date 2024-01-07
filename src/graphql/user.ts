import { PrismaClient } from "@prisma/client";
import { nanoid } from "nanoid";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const typeDef = `
	extend type Query {
		getUsers: [User]
		getUser(id:ID!):User
		verifyUsernameOrEmailExist(username:String,email:String):[User]
		loginUser(username:String!,password:String!):User
	}

	type Mutation{
		createUser(username:String!,password:String!,email:String!):User
		updateUser(user_id:ID!,username:String,password:String,email:String,last_reward_claimed_date:String,is_active:Boolean):User
		deleteUser(user_id:ID!):User
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
		verifyUsernameOrEmailExist: async (_: unknown, args: { username: string; email: string }) => {
			const user = await prisma.users.findMany({
				where: {
					OR: [{ email: { equals: args.email } }, { username: { equals: args.username } }],
				},
			});
			console.log(user);
			return user;
		},
		loginUser: async (_: unknown, args: { username: string; password: string }) => {
			const userDB = await prisma.users.findUnique({
				where: {
					username: args.username,
				},
			});

			if (!userDB) {
				throw new Error(`Username ${args.username} doesn't exist. Please try again.`);
			}

			//TODO: verify if the user is active or not

			// Confirm password
			const match = await bcrypt.compare(args.password, userDB.password);

			if (!match) {
				throw new Error("The password don't match. Please try again.");
			}

			return userDB;
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
				user_id: string;
				username: string;
				email: string;
				last_reward_claimed_date: string;
				is_active: boolean;
			}
		) => {
			const { user_id, username, email, last_reward_claimed_date, is_active } = args;

			// This resolver will not change the password, cause I prefer make a specific resolver for that action.
			// TODO: resolver to change password.
			const updatedUser = await prisma.users.update({
				where: {
					user_id: user_id,
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
		deleteUser: async (_: unknown, args: { user_id: string }) => {
			// For users has been implemented a soft delete for preserve the email accounts registered.
			const deleteUser = await prisma.users.update({
				where: {
					user_id: args.user_id,
				},
				data: {
					is_active: false,
				},
			});

			return deleteUser;
		},
	},
};
