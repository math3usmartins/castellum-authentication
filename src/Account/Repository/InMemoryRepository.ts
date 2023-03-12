import type { AccountRepository } from "../AccountRepository"
import { Account } from "../../Account"
import { AccountNotFoundError } from "./Error/AccountNotFoundError"
import { AccountId } from "../AccountId"
import type { AccountUsername } from "../AccountUsername"
import { AccountAlreadyExists } from "./Error/AccountAlreadyExists"
import type { SignUpTokenGenerator } from "../../SignUp/Token/SignUpTokenGenerator"

export class InMemoryRepository implements AccountRepository {
	constructor(private readonly tokenGenereator: SignUpTokenGenerator, private accounts: Account[]) {}

	public async getByUsername(username: AccountUsername): Promise<Account> {
		const account: Account | undefined = this.accounts.find((a: Account): boolean => a.username === username)

		return account instanceof Account
			? await Promise.resolve(account)
			: await Promise.reject(new AccountNotFoundError())
	}

	public async create(username: AccountUsername, timestamp: number): Promise<Account> {
		const alreadyExistingAccount: Account | undefined = this.accounts.find((account: Account) =>
			account.username.equal(username),
		)

		if (alreadyExistingAccount instanceof Account) {
			return await Promise.reject(new AccountAlreadyExists())
		}

		const id = this.accounts.length + 1
		const accountId = new AccountId(`user-${id}`)
		const token = await this.tokenGenereator.generate(accountId, timestamp)
		const account = new Account(accountId, username, token)

		this.accounts = [...this.accounts, account]

		return account
	}

	public async getById(id: AccountId): Promise<Account> {
		const account = this.accounts.find((account: Account) => account.id.equal(id))

		if (undefined === account) {
			return await Promise.reject(new AccountNotFoundError())
		}

		return await Promise.resolve(account)
	}

	public async update(account: Account): Promise<void> {
		const existingAccount = this.accounts.find((existingAccount: Account) => existingAccount.id.equal(account.id))

		if (undefined === existingAccount) {
			await Promise.reject(new AccountNotFoundError())
			return
		}

		this.accounts = this.accounts.map((existingAccount: Account) =>
			existingAccount.id.equal(account.id) ? account : existingAccount,
		)

		await Promise.resolve()
	}
}
