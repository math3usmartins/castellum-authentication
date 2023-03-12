import type { AccountId } from "./Account/AccountId"
import type { AccountUsername } from "./Account/AccountUsername"
import type { SignUpToken } from "./SignUp/SignUpToken"

export class Account {
	private active: boolean = false

	constructor(
		public readonly id: AccountId,
		public readonly username: AccountUsername,
		public readonly signUpToken: SignUpToken,
	) {}

	public isActive = (): boolean => this.active

	public activate(): Account {
		const account = new Account(this.id, this.username, this.signUpToken)
		account.active = true

		return account
	}
}
