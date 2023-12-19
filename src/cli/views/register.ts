import input from "@inquirer/input";
import { select } from "@inquirer/prompts";
import password from "@inquirer/password";
import chalk from "chalk";

import { UserSingleton } from "../models/User.js";
import { createUserService, verifyUserExist } from "../services/user.services.js";
import { createSpinner } from "../helpers/customSpinner.js";

const { user } = UserSingleton.getInstance();

export const registerMenu = async () => {
	console.clear();
	console.log("_________________________________________________________\n");
	console.log(chalk.blueBright("          Register your data"));
	console.log("_________________________________________________________\n");

	const username = await input({ message: chalk.yellow("Enter your username:") });
	const email = await input({ message: chalk.yellow("Enter your email: ") });
	const userPassword = await password({ message: chalk.yellow("Enter your password:"), mask: true });
	const confirmPassword = await password({ message: chalk.yellow("Confirm your password:"), mask: true });

	// 1. Verify that passwords are equal.
	// TODO: handle users that aren't active.
	if (userPassword !== confirmPassword) {
		console.clear();

		const option = await select({
			message: "The passwords don't match. Please try again.",
			choices: [
				{ value: "register", name: chalk.yellowBright("Try again") },
				{ value: "index", name: chalk.hex("e03131")("Back") },
			],
		});
		return option;
	}

	// 2. Get the user in DB by username and verify that username and email are unique.
	const result = await verifyUserExist(username, email);
	const { verifyUsernameOrEmailExist } = result.data.data;

	// If the server found a register with the email or username, it will return an array with this data.
	if (verifyUsernameOrEmailExist.length !== 0) {
		const option = await select({
			message: `The user ${verifyUsernameOrEmailExist[0].username} already exists. Try with another username`,
			choices: [
				{ value: "register", name: chalk.yellowBright("Try again") },
				{ value: "index", name: chalk.hex("e03131")("Back") },
			],
		});
		return option;
	}

	// 3. Create an user in DB
	const resultCreateQuery = await createUserService(username, userPassword, email);
	const { createUser } = resultCreateQuery.data.data;

	// 4. Assign the data to UserSingletone
	user.id = createUser.user_id;
	user.username = createUser.username;
	user.email = createUser.email;
	user.lastRewardClaimedDate = createUser.last_reward_claimed_date;
	console.clear();
	console.log("---------------------------------------------------------");
	console.log("               Welcome to GraphQL Card Trade");
	console.log("---------------------------------------------------------\n");
	await createSpinner(`Thanks you for registering ${user.username}. Wait while we do the final adjustments.`, 3000);
	return "home";
};
