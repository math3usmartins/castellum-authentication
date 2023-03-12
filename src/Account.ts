import type { AccountId } from "./Account/AccountId"
import type { AccountUsername } from "./Account/AccountUsername"

export class Account {
	constructor(public readonly id: AccountId, public readonly username: AccountUsername) {}
}
