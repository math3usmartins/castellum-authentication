import type { AccountRepository } from "../AccountRepository"
import { Account } from "../../Account"
import { AccountNotFoundError } from "./Error/AccountNotFoundError"
import { AccountId } from "../AccountId"
import type { AccountUsername } from "../AccountUsername"
import { AccountAlreadyExists } from "./Error/AccountAlreadyExists"

export class InMemoryRepository implements AccountRepository {
	constructor(private accounts: Account[]) {}

	public async getByUsername(username: AccountUsername): Promise<Account> {
		const account: Account | undefined = this.accounts.find((a: Account): boolean => a.username === username)

		return account instanceof Account
			? await Promise.resolve(account)
			: await Promise.reject(new AccountNotFoundError())
	}

	public async create(username: AccountUsername): Promise<Account> {
		const alreadyExistingAccount: Account | undefined = this.accounts.find((account: Account) =>
			account.username.equal(username),
		)

		if (alreadyExistingAccount instanceof Account) {
			return await Promise.reject(new AccountAlreadyExists())
		}

		const id = this.accounts.length + 1
		const account = new Account(new AccountId(`user-${id}`), username)

		this.accounts = [...this.accounts, account]

		return account
	}
}
