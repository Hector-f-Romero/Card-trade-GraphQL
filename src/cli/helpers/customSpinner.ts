import { setTimeout } from "timers/promises";

import ora from "ora";
import chalk from "chalk";

export const createSpinner = async (message?: string, waitTime?: number) => {
	const spinner = ora({
		text: chalk.yellowBright(message),
		spinner: "boxBounce2",
	}).start();
	await setTimeout(waitTime);
	spinner.stop();
};
