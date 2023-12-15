import chalk from "chalk";

export const applyColorToRarity = (rarity: string) => {
	let hexColor: string = "";
	switch (rarity) {
		case "Common":
			hexColor = "C3A868";
			break;
		case "Rare":
			hexColor = "5CD3CD";
			break;
		case "Epic":
			hexColor = "B05CC7";
			break;
		case "Legendary":
			hexColor = "F2A400";
			break;
		default:
			// Default will use common rarity color
			hexColor = "C3A868";
			break;
	}
	return chalk.hex(hexColor)(rarity);
};
