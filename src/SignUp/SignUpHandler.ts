import type { AccountRepository } from "../Account/AccountRepository"
import { AccountNotFoundError } from "../Account/Repository/Error/AccountNotFoundError"
import type { AccountUsername } from "../Account/AccountUsername"
import type { AccountId } from "../Account/AccountId"
import type { TokenValidator } from "./TokenValidator"

export class SignUpHandler {
	constructor(private readonly tokenValidator: TokenValidator, private readonly repository: AccountRepository) {}

	public async signup(username: AccountUsername, timestamp: number): Promise<AccountId> {
		return await this.repository
			.getByUsername(username)
			.then(async (account) => account.id)
			.catch(async (reason) =>
				reason instanceof AccountNotFoundError
					? await this.newAccount(username, timestamp)
					: await Promise.reject(reason),
			)
	}

	public async activate(id: AccountId, timestamp: number, token: string): Promise<void> {
		const account = await this.repository.getById(id)

		this.tokenValidator.validate(account, timestamp, token)

		await this.repository.update(account.activate())
	}

	private async newAccount(email: AccountUsername, timestamp: number): Promise<AccountId> {
		const account = await this.repository.create(email, timestamp)

		return account.id
	}
}
