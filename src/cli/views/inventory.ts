import select from "@inquirer/select";
import chalk from "chalk";

import { UserSingleton } from "../models/User.js";
import { getInventoryUser } from "../services/user.services.js";

type InventoryCard = {
	card_id: string;
	name: string;
	description: string;
	value: number;
	rarity: string;
	amount: number;
};

const getUserCards = async () => {
	try {
		const { user } = UserSingleton.getInstance();
		const result = await getInventoryUser(user.id);
		// console.log(result.data.data.getUserInventory);
		const cardsDB: InventoryCard[] = result.data.data.getUserInventory;
		const cards = cardsDB.map((card) => {
			return { value: card.card_id, name: `${chalk.cyan(card.name)} - ${card.rarity} [${card.amount}]` };
		});

		// Add 'exit' option to the end of the list.
		cards.push({ value: "home", name: chalk.hex("e03131")("Exit") });
		// console.log(cards);
		return cards;
	} catch (error: any) {
		console.log(error.response.data);
	}
};

export const inventoryMenu = async () => {
	console.clear();
	console.log("_________________________________________________________\n");
	console.log(chalk.whiteBright("         Look your cards 📂"));
	console.log("_________________________________________________________\n");

	const cards = await getUserCards();
	// console.log(cards);

	const option = await select({ message: "Choose a card to get more information about this", choices: cards });
	return option;
};
