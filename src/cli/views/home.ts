import inquirer, { QuestionCollection } from "inquirer";
import chalk from "chalk";

const homeQuest: QuestionCollection = [
	{
		type: "list",
		name: "option",
		message: "Choose and option",
		choices: [
			{
				value: 1,
				name: chalk.greenBright("1. Login"),
			},
			{
				value: 2,
				name: chalk.cyanBright("2. Register"),
			},
			{
				value: 0,
				name: chalk.red("0. Exit"),
			},
		],
		prefix: ">",
	},
];

export const homeMenu = async () => {
	console.log("_________________________________________________________\n");
	console.log(chalk.whiteBright("           Welcome to Trade Card GraphQL 👽"));
	console.log("_________________________________________________________\n");

	const { option } = await inquirer.prompt(homeQuest);
	return option;
};
