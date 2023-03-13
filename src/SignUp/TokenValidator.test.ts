import assert from "assert"
import "mocha"
import { AccountUsername } from "../Account/AccountUsername"
import { AccountId } from "../Account/AccountId"
import { Account } from "../Account"
import { SignUpToken } from "./SignUpToken"
import { TokenValidator } from "./TokenValidator"
import { BadSignUpToken } from "./Error/BadSignUpToken"
import { AccountAlreadyActivated } from "./Error/AccountAlreadyActivated"

describe("TokenValidator", () => {
	const timestamp = 1678660707

	it("must accept valid token", (): void => {
		const validator = new TokenValidator()

		const accountId = new AccountId("user-1")
		const account = new Account(
			accountId,
			new AccountUsername("person"),
			new SignUpToken("good-token", timestamp, accountId),
		)

		validator.validate(account, timestamp, "good-token")
		assert.equal(true, true)
	})

	it("must reject already active account", (): void => {
		const validator = new TokenValidator()

		const accountId = new AccountId("user-1")
		const account = new Account(
			accountId,
			new AccountUsername("person"),
			new SignUpToken("good-token", timestamp, accountId),
		)

		assert.throws(() => {
			validator.validate(account.activate(), timestamp, "good-token")
		}, AccountAlreadyActivated)
	})

	it("must reject already expired token", (): void => {
		const validator = new TokenValidator()

		const accountId = new AccountId("user-1")
		const account = new Account(
			accountId,
			new AccountUsername("person"),
			new SignUpToken("good-token", timestamp - 1, accountId),
		)

		assert.throws(() => {
			validator.validate(account, timestamp, "good-token")
		}, BadSignUpToken)
	})

	it("must reject bad token value", (): void => {
		const validator = new TokenValidator()

		const accountId = new AccountId("user-1")
		const account = new Account(
			accountId,
			new AccountUsername("person"),
			new SignUpToken("good-token", timestamp, accountId),
		)

		assert.throws(() => {
			validator.validate(account, timestamp, "bad-token")
		}, BadSignUpToken)
	})
})
