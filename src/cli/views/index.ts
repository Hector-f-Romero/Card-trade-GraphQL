import select from "@inquirer/select";
import chalk from "chalk";

const indexQuest = {
	message: "Choose and option",
	choices: [
		{
			value: "login",
			name: chalk.greenBright("1. Login"),
		},
		{
			value: "register",
			name: chalk.cyanBright("2. Register"),
		},
		{
			value: "exit",
			name: chalk.hex("e03131")("0. Exit"),
		},
	],
};
export const indexMenu = async () => {
	console.clear();
	console.log("_________________________________________________________\n");
	console.log(chalk.whiteBright("           Welcome to Trade Card GraphQL 👽"));
	console.log("_________________________________________________________\n");

	const option = await select(indexQuest);
	return option;
};
