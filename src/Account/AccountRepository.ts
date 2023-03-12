import type { Account } from "../Account"
import type { AccountUsername } from "./AccountUsername"
import type { AccountId } from "./AccountId"

export interface AccountRepository {
	create: (username: AccountUsername, timestamp: number) => Promise<Account>
	update: (account: Account) => Promise<void>
	getById: (id: AccountId) => Promise<Account>
	getByUsername: (username: AccountUsername) => Promise<Account>
}
