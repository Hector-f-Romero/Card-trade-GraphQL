export type CardInventory = {
	card_id: string;
	name: string;
	description: string;
	value: number;
	rarity: string;
	amount: number;
};

export type InventoryRecord = {
	inventory_id: string;
	user_id: string;
	card_id: string;
	amount?: number;
	created_at?: string;
	updated_at?: string;
};
