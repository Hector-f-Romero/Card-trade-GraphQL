import input from "@inquirer/input";
import password from "@inquirer/password";
import chalk from "chalk";

export const loginMenu = async () => {
	console.clear();

	const username = await input({ message: chalk.yellow("Enter your username:") });
	const userPassword = await password({ message: chalk.yellow("Enter your password:"), mask: true });
};
