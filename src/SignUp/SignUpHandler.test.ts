import assert from "assert"
import "mocha"
import { InMemoryRepository } from "../Account/Repository/InMemoryRepository"
import { SignUpHandler } from "./SignUpHandler"
import { AccountUsername } from "../Account/AccountUsername"
import { AccountAlreadyActivated } from "./Error/AccountAlreadyActivated"

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

	it("must activate an account", async (): Promise<void> => {
		const repository = new InMemoryRepository([])
		const handler = new SignUpHandler(repository)

		const accountId = await handler.signup(person)
		let account = await repository.getById(accountId)
		assert.equal(false, account.isActive())

		await handler.activate(accountId)
		account = await repository.getById(accountId)
		assert.equal(true, account.isActive())
	})

	it("must fail to active an already activated account", async (): Promise<void> => {
		const repository = new InMemoryRepository([])
		const handler = new SignUpHandler(repository)

		const accountId = await handler.signup(person)
		await handler.activate(accountId)

		const failed = await handler
			.activate(accountId)
			.then(() => false)
			.catch((err) => err instanceof AccountAlreadyActivated)

		assert.equal(failed, true)
	})
})
