import type { Account } from "../Account"
import { AccountAlreadyActivated } from "./Error/AccountAlreadyActivated"
import { BadSignUpToken } from "./Error/BadSignUpToken"

export class TokenValidator {
	public validate(account: Account, timestamp: number, token: string): void {
		if (account.isActive()) {
			throw new AccountAlreadyActivated()
		}

		if (account.signUpToken.value !== token) {
			throw new BadSignUpToken()
		}

		if (account.signUpToken.expiresAt < timestamp) {
			throw new BadSignUpToken()
		}
	}
}
