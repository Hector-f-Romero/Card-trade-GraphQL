import select, { Separator } from "@inquirer/select";
import chalk from "chalk";

import { UserSingleton } from "../models/User.js";
import { getInventoryUser } from "../services/user.services.js";
import { applyColorToRarity } from "../helpers/applyColors.js";

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
		// Obtain the information of the user that has been logged in.
		const { user } = UserSingleton.getInstance();
		const result = await getInventoryUser(user.id);
		// Obtain the cards from the response to GraphQL server
		const cardsDB: InventoryCard[] = result.data.data.getUserInventory;

		// TODO: fix the type for this variable
		let cards: unknown[];

		// If the users don't have any cards, display the following interface.
		if (cardsDB.length === 0) {
			cards = [
				{ name: chalk.hex("FABC2C")("You don't any have cards yet"), value: "no-available", disabled: true },
			];
			cards.push(new Separator("------------------------------------------------------"));
			cards.push({ value: "home", name: chalk.hex("e03131")("Exit") });
			cards.push(new Separator("------------------------------------------------------------------------------"));
			return cards;
		}

		cards = cardsDB.map((card) => {
			return {
				value: card.card_id,
				name: `${chalk.cyan(card.name)} - ${applyColorToRarity(card.rarity)} [${card.amount}]`,
			};
		});

		// Add 'exit' option to the end of the list.
		cards.push(new Separator("------------------------------------------------------------------------------"));
		cards.push({ value: "home", name: chalk.hex("e03131")("Exit") });
		cards.push(new Separator("------------------------------------------------------------------------------"));
		// console.log(cards);
		return cards;
	} catch (error: any) {
		console.log(error.response.data);
	}
};

export const inventoryMenu = async () => {
	console.clear();
	console.log("______________________________________________________________________________\n");
	console.log(chalk.whiteBright("         		Look your cards 📂"));
	console.log("______________________________________________________________________________\n");

	const cards = await getUserCards();
	// console.log(cards);

	const option: string = await select({
		message: "Choose a card to get more information about this",
		choices: cards,
		pageSize: 15,
	});
	return option;
};
