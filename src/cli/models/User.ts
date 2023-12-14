type User = {
	id: string;
	username: string;
	email: string;
};

// We use a Singleton patter to create a global access for user variables. Only can exists one user at time.
export class UserSingleton {
	private static instance: UserSingleton;
	public user: User;

	constructor() {
		this.user = {
			id: "",
			username: "",
			email: "",
		};
	}

	public static getInstance() {
		if (!UserSingleton.instance) {
			UserSingleton.instance = new UserSingleton();
		}
		return UserSingleton.instance;
	}
}
