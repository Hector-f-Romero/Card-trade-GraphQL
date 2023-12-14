import { setTimeout } from "timers/promises";

import input from "@inquirer/input";
import { select } from "@inquirer/prompts";
import password from "@inquirer/password";
import chalk from "chalk";
import ora from "ora";
import bcrypt from "bcrypt";

import { PrismaClient } from "@prisma/client";
import { UserSingleton } from "../models/User.js";

const prisma = new PrismaClient();

export const loginMenu = async () => {
	console.clear();

	const username = await input({ message: chalk.yellow("Enter your username:") });
	const userPassword = await password({ message: chalk.yellow("Enter your password:"), mask: true });

	// 1. Get the user from DB
	const userDB = await prisma.users.findUnique({
		where: {
			username,
		},
	});

	// 2. Verify if the user exists
	if (!userDB) {
		// TODO: bring back to home view
		console.clear();
		const spinner = ora({
			text: chalk.yellowBright(`Doesn't exist username ${chalk.redBright(username)}. Please try again.`),
			spinner: "boxBounce2",
		}).start();

		// Wait 2 seconds to show the feedback.
		await setTimeout(2000);
		spinner.stop();

		const option = await select({
			message: "What do you want to do?",
			choices: [
				{ value: "login", name: chalk.yellowBright("Try again") },
				{ value: "index", name: chalk.hex("e03131")("Back") },
			],
		});
		return option;
	}

	// 3. Confirm password
	const match = await bcrypt.compare(userPassword, userDB.password);

	if (!match) {
		console.clear();
		const option = await select({
			message: "Password doesn't match. Try again",
			choices: [
				{ value: "login", name: chalk.yellowBright("Try again") },
				{ value: "index", name: chalk.hex("e03131")("Back") },
			],
		});
		return option;
	}

	// 4. Go to home view and save the user data.
	const { user } = UserSingleton.getInstance();
	user.id = userDB.user_id;
	user.username = userDB.username;
	user.email = userDB.email;
	return "home";
};
