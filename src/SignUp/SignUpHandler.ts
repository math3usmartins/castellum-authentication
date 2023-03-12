import type { AccountRepository } from "../Account/AccountRepository"
import { AccountNotFoundError } from "../Account/Repository/Error/AccountNotFoundError"
import type { AccountUsername } from "../Account/AccountUsername"
import type { AccountId } from "../Account/AccountId"

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

	private async newAccount(email: AccountUsername): Promise<AccountId> {
		const account = await this.repository.create(email)

		return account.id
	}
}
