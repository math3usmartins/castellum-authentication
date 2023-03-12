import assert from "assert"
import "mocha"
import { InMemoryRepository } from "./InMemoryRepository"
import { AccountUsername } from "../AccountUsername"
import { AccountAlreadyExists } from "./Error/AccountAlreadyExists"
import { AccountId } from "../AccountId"
import { Account } from "../../Account"
import { AccountNotFoundError } from "./Error/AccountNotFoundError"

describe("InMemoryRepository", () => {
	const person = new AccountUsername("person")
	const anotherPerson = new AccountUsername("another-person")

	it("must create an account with given username and auto-generated ID", async () => {
		const repository = new InMemoryRepository([])
		const account = await repository.create(person)

		assert.equal("user-1", account.id.value)
		assert.equal(person.value, account.username.value)
		assert.equal(account.isActive(), false)

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

	it("must get by ID", async () => {
		const repository = new InMemoryRepository([])
		await repository.create(person)
		await repository.create(anotherPerson)

		const account = await repository.getById(new AccountId("user-2"))

		assert.equal(anotherPerson.value, account.username.value)
	})

	it("must update an account", async () => {
		const repository = new InMemoryRepository([])
		const account = await repository.create(person)

		const anotherAccount = await repository.create(anotherPerson)
		const activeAccount = anotherAccount.activate()

		await repository.update(activeAccount)

		const updatedAccount = await repository.getById(new AccountId("user-2"))

		assert.equal(updatedAccount.isActive(), true)
		assert.deepStrictEqual(repository, new InMemoryRepository([account, activeAccount]))
	})

	it("must fail to update a not existing account", async () => {
		const repository = new InMemoryRepository([])

		const failed = await repository
			.update(new Account(new AccountId("bad-id"), new AccountUsername("bad-username")))
			.then(() => false)
			.catch((err) => err instanceof AccountNotFoundError)

		assert.equal(failed, true)
	})

	it("must fail to signup when account already exists", async () => {
		const repository = new InMemoryRepository([])
		await repository.create(person)

		const failed: boolean = await repository
			.create(person)
			.then(() => false)
			.catch((err) => err instanceof AccountAlreadyExists)

		assert.equal(failed, true)
	})
})
