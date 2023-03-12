import type { AccountId } from "./Account/AccountId"
import type { AccountUsername } from "./Account/AccountUsername"

export class Account {
	private active: boolean = false

	constructor(public readonly id: AccountId, public readonly username: AccountUsername) {}

	public isActive = (): boolean => this.active

	public activate(): Account {
		const account = new Account(this.id, this.username)
		account.active = true

		return account
	}
}
