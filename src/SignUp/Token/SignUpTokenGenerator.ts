import type { SignUpToken } from "../SignUpToken"
import type { AccountId } from "../../Account/AccountId"

export interface SignUpTokenGenerator {
	generate: (account: AccountId, timestamp: number) => Promise<SignUpToken>
}
