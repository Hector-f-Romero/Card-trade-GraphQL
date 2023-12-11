import { homeMenu } from "./views/home.js";
import { loginMenu } from "./views/login.js";

// Use a main function to hanlde menu and interfaces
const main = async () => {
	let option: number;

	do {
		console.clear();
		// Show the cli interface while the user doesn't choose 'exit'
		option = await homeMenu();

		switch (option) {
			// Choose a login option
			case 1:
				// TODO: create login logic
				await loginMenu();
				break;
			// Choose a register option
			case 2:
				// TODO: create a register logic
				break;
			case 0:
				console.log("Thanks for all. Press Enter to exit\nHope to see you later");
				break;
		}
	} while (option !== 0);
};

main();
