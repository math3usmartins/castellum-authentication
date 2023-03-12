import assert from "assert"
import "mocha"
import { InMemoryRepository } from "./InMemoryRepository"
import { AccountUsername } from "../AccountUsername"
import { AccountAlreadyExists } from "./Error/AccountAlreadyExists"

describe("InMemoryRepository", () => {
	const person = new AccountUsername("person")
	const anotherPerson = new AccountUsername("another-person")

	it("must create an account with given username and auto-generated ID", async () => {
		const repository = new InMemoryRepository([])
		const account = await repository.create(person)

		assert.equal("user-1", account.id.value)
		assert.equal(person.value, account.username.value)

		assert.deepStrictEqual(repository, new InMemoryRepository([account]))
	})

	it("must create more than one account", async () => {
		const repository = new InMemoryRepository([])

		const account = await repository.create(person)
		assert.equal("user-1", account.id.value)
		assert.equal(person.value, account.username.value)

		const anotherAccount = await repository.create(anotherPerson)
		assert.equal("user-2", anotherAccount.id.value)
		assert.equal(anotherPerson.value, anotherAccount.username.value)

		assert.deepStrictEqual(repository, new InMemoryRepository([account, anotherAccount]))
	})

	it("must get by username", async () => {
		const repository = new InMemoryRepository([])
		await repository.create(person)
		await repository.create(anotherPerson)

		const account = await repository.getByUsername(anotherPerson)

		assert.equal("user-2", account.id.value)
		assert.equal(anotherPerson.value, account.username.value)
	})

	it("must fail when account already exists", async () => {
		const repository = new InMemoryRepository([])
		await repository.create(person)

		const failed: boolean = await repository
			.create(person)
			.then(() => false)
			.catch((err) => err instanceof AccountAlreadyExists)

		assert.equal(failed, true)
	})
})
