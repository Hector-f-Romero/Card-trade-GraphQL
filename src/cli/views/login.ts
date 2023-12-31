import { setTimeout } from "timers/promises";

import input from "@inquirer/input";
import { select } from "@inquirer/prompts";
import password from "@inquirer/password";
import chalk from "chalk";
import ora from "ora";

import { UserSingleton } from "../models/User.js";
import { loginUserService } from "../services/user.services.js";

export const loginMenu = async () => {
	console.clear();

	const username = await input({ message: chalk.yellow("Enter your username:") });
	const userPassword = await password({ message: chalk.yellow("Enter your password:"), mask: true });

	// Get the user from DB
	const { data } = await loginUserService(username, userPassword);

	if (data.errors) {
		console.clear();
		const spinner = ora({
			text: chalk.yellowBright(`${data.errors[0].message}`),
			spinner: "boxBounce2",
		}).start();

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
	// Extract user info from request.
	const userData = data.data.loginUser;

	// Go to home view and save the user data.
	const { user } = UserSingleton.getInstance();
	user.id = userData.user_id;
	user.username = userData.username;
	user.email = userData.email;
	user.lastRewardClaimedDate = userData.last_reward_claimed_date;
	return "home";
};
