import assert from "assert"
import "mocha"
import { InMemoryRepository } from "../Account/Repository/InMemoryRepository"
import { SignUpHandler } from "./SignUpHandler"
import { AccountUsername } from "../Account/AccountUsername"

const person = new AccountUsername("person")

describe("SignUpHandler", () => {
	it("must create account", async (): Promise<void> => {
		const repository = new InMemoryRepository([])
		const handler = new SignUpHandler(repository)

		const accountId = await handler.signup(person)
		assert.equal("user-1", accountId.value)
	})

	it("must return existing account ID when already signed up", async (): Promise<void> => {
		const repository = new InMemoryRepository([])
		const handler = new SignUpHandler(repository)

		const accountId = await handler.signup(person)
		assert.equal("user-1", accountId.value)

		const accountIdAgain = await handler.signup(person)
		assert.equal("user-1", accountIdAgain.value)
	})
})
