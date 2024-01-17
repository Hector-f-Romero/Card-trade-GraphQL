export type User = {
	user_id: string;
	username?: string;
	password?: string;
	email?: string;
	last_reward_claimed_date?: string;
	is_active?: boolean;
	created_at?: string;
	updated_at?: string;
};

export type UserRoom = {
	user_id: string;
	username: string;
};
