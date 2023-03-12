import type { Account } from "../Account"
import type { AccountUsername } from "./AccountUsername"

export interface AccountRepository {
	create: (username: AccountUsername) => Promise<Account>
	getByUsername: (username: AccountUsername) => Promise<Account>
}
