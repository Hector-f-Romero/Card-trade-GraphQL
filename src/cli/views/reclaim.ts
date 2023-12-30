import { select } from "@inquirer/prompts";
import chalk from "chalk";

import { UserSingleton } from "../models/User.js";
import { checkCanReclaimCards } from "../helpers/handleTime.js";
import { getRandomCardsService } from "../services/card.services.js";

const { user } = UserSingleton.getInstance();
let canReclaimCards: boolean = false;

export const reclaimCardsMenu = async () => {
	console.clear();

	canReclaimCards = checkCanReclaimCards(user.lastRewardClaimedDate);

	const reclaimMenu = {
		message: "Which option do you want a choose?",
		choices: [
			{ value: "reclaimCard", name: chalk.hex("2f9e44")("Reclaim"), disabled: !canReclaimCards },
			{ value: "home", name: chalk.hex("e03131")("Back to home") },
		],
	};

	console.log("------------------------------------------------------------------------------");
	console.log("                               You can reclaim now");
	console.log("------------------------------------------------------------------------------\n");
	const option = await select(reclaimMenu);

	if (option === "reclaimCard") {
		// Get the random cards for the user.
		console.log(user.id);
		const { data } = await getRandomCardsService(user.id);
		const cardsDB = data.data.getRandomCards;

		// Save in the cards in user inventory
		console.log(cardsDB);
		// await setTimeout(7000);

		return "reclaim";
	} else {
		return option;
	}
};
