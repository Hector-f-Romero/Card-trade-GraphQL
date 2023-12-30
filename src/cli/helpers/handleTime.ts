import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";

dayjs.extend(utc);

export const checkCanReclaimCards = (claimedDate: Date | null) => {
	// 1. Verify if it's the first time that user reclaim cards
	if (claimedDate === null) {
		console.log("Primera vez que reclama");
		return true;
	}

	// 2. Get the current Date in UTC (for avoid problems with time zones).
	const currentDateUTC = dayjs().utc();
	// 3. Calcule the difference between the current time and the last reward claimed date.
	const diff = currentDateUTC.diff(claimedDate);
	// console.log(diff / 1000 / 60);

	// 4. If the difference is greather than 2 minutes (120000 miliseconds), the user can reclaim again.
	if (diff > 120000) {
		return true;
	} else {
		return false;
	}
};
