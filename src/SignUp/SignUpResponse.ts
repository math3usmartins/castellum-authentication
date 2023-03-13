import type { AccountId } from "../Account/AccountId"
import type { SignUpToken } from "./SignUpToken"
import type { Account } from "../Account"

export class SignUpResponse {
	constructor(public readonly accountId: AccountId, public readonly token: SignUpToken) {}

	public static fromAccount(account: Account): SignUpResponse {
		return new SignUpResponse(account.id, account.signUpToken)
	}
}
