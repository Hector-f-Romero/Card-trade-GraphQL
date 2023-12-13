import select from "@inquirer/select";
import chalk from "chalk";

const homeQuest = {
	message: "What do you want to do?",
	choices: [
		{ value: "inventory", name: chalk.hex("2f9e44")("Inventory") },
		{ value: "gift", name: chalk.hex("1971c2")("Reclaim gift") },
		{ value: "trade", name: chalk.hex("f08c00")("Trade") },
		{ value: "index", name: chalk.hex("e03131")("Exit") },
	],
};

export const homeMenu = async () => {
	console.clear();
	console.log("_________________________________________________________\n");
	console.log(chalk.whiteBright("           		Welcome to Home 🃏"));
	console.log("_________________________________________________________\n");
	const option = await select(homeQuest);
	console.log(option);
	return option;
};
