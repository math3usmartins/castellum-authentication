import type { AccountRepository } from "../Account/AccountRepository"
import { AccountNotFoundError } from "../Account/Repository/Error/AccountNotFoundError"
import type { AccountUsername } from "../Account/AccountUsername"
import type { AccountId } from "../Account/AccountId"
import { AccountAlreadyActivated } from "./Error/AccountAlreadyActivated"

export class SignUpHandler {
	constructor(private readonly repository: AccountRepository) {}

	public async signup(username: AccountUsername): Promise<AccountId> {
		return await this.repository
			.getByUsername(username)
			.then(async (account) => account.id)
			.catch(async (reason) =>
				reason instanceof AccountNotFoundError ? await this.newAccount(username) : await Promise.reject(reason),
			)
	}

	public async activate(id: AccountId): Promise<void> {
		const account = await this.repository.getById(id)

		if (account.isActive()) {
			await Promise.reject(new AccountAlreadyActivated())
			return
		}

		await this.repository.update(account.activate())
	}

	private async newAccount(email: AccountUsername): Promise<AccountId> {
		const account = await this.repository.create(email)

		return account.id
	}
}
