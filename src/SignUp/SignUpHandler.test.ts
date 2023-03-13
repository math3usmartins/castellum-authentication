import assert from "assert"
import "mocha"
import { InMemoryRepository } from "../Account/Repository/InMemoryRepository"
import { SignUpHandler } from "./SignUpHandler"
import { AccountUsername } from "../Account/AccountUsername"
import { AccountAlreadyActivated } from "./Error/AccountAlreadyActivated"
import { InMemoryGenerator } from "./Token/Generator/InMemoryGenerator"
import { TokenValidator } from "./TokenValidator"

class SignUpHandlerTestContext {
	public readonly tokenGenerator: InMemoryGenerator
	public readonly repository: InMemoryRepository
	public readonly handler: SignUpHandler

	public constructor() {
		this.tokenGenerator = new InMemoryGenerator(30, [])
		this.repository = new InMemoryRepository(this.tokenGenerator, [])
		this.handler = new SignUpHandler(new TokenValidator(), this.repository)
	}
}

describe("SignUpHandler", () => {
	const person = new AccountUsername("person")
	const timestamp = 1678660707

	it("must create account", async (): Promise<void> => {
		const { handler } = new SignUpHandlerTestContext()

		const accountId = await handler.signup(person, timestamp)
		assert.equal("user-1", accountId.value)
	})

	it("must return existing account ID when already signed up", async (): Promise<void> => {
		const { handler } = new SignUpHandlerTestContext()

		const accountId = await handler.signup(person, timestamp)
		assert.equal("user-1", accountId.value)

		const accountIdAgain = await handler.signup(person, timestamp)
		assert.equal("user-1", accountIdAgain.value)
	})

	it("must activate an account", async (): Promise<void> => {
		const { handler, repository } = new SignUpHandlerTestContext()

		const accountId = await handler.signup(person, timestamp)
		let account = await repository.getById(accountId)
		assert.equal(false, account.isActive())

		await handler.activate(accountId, timestamp, "token-1")
		account = await repository.getById(accountId)
		assert.equal(true, account.isActive())
	})

	it("must fail to active an already activated account", async (): Promise<void> => {
		const { handler } = new SignUpHandlerTestContext()

		const accountId = await handler.signup(person, timestamp)
		await handler.activate(accountId, timestamp, "token-1")

		const failed = await handler
			.activate(accountId, timestamp, "token-1")
			.then(() => false)
			.catch((err) => err instanceof AccountAlreadyActivated)

		assert.equal(failed, true)
	})
})
