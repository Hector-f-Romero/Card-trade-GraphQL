import { UserRoom } from "../types/user.type.js";

export class TradeRoomManager {
	private static instance: TradeRoomManager;
	public tradeRooms: TradeRoom[];

	constructor() {
		this.tradeRooms = [];
	}

	public static getInstance() {
		if (!TradeRoomManager.instance) {
			TradeRoomManager.instance = new TradeRoomManager();
		}
		return TradeRoomManager.instance;
	}

	public static getTradeRoom(id: string) {
		return this.instance.tradeRooms.find((room) => room.room_id === id);
	}
}

export enum TradeRoomStates {
	AVAILABLE = "Available",
	IN_USE = "In use",
	EMPTY = "Empty",
}

export class TradeRoom {
	public room_id: string;
	public users: UserRoom[];
	public status: TradeRoomStates;

	constructor(room_id: string, users: UserRoom[], status: TradeRoomStates) {
		this.room_id = room_id;
		this.users = users;
		this.status = status;
	}
}
