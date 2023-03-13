import assert from "assert"
import "mocha"
import { InMemoryRepository } from "./InMemoryRepository"
import { AccountUsername } from "../AccountUsername"
import { AccountAlreadyExists } from "./Error/AccountAlreadyExists"
import { AccountId } from "../AccountId"
import { Account } from "../../Account"
import { AccountNotFoundError } from "./Error/AccountNotFoundError"
import { InMemoryGenerator } from "../../SignUp/Token/Generator/InMemoryGenerator"
import { SignUpToken } from "../../SignUp/SignUpToken"

class InMemoryRepositoryTestContext {
	public readonly tokenGenerator: InMemoryGenerator
	public readonly repository: InMemoryRepository

	public constructor() {
		this.tokenGenerator = new InMemoryGenerator(30, [])
		this.repository = new InMemoryRepository(this.tokenGenerator, [])
	}
}

describe("InMemoryRepository", () => {
	const timestamp = 1678660707
	const person = new AccountUsername("person")
	const anotherPerson = new AccountUsername("another-person")

	it("must create an account with given username and auto-generated ID", async () => {
		const { repository, tokenGenerator } = new InMemoryRepositoryTestContext()
		const account = await repository.create(person, timestamp)

		assert.equal("user-1", account.id.value)
		assert.equal(person.value, account.username.value)
		assert.equal(account.isActive(), false)

		assert.deepStrictEqual(repository, new InMemoryRepository(tokenGenerator, [account]))
	})

	it("must create more than one account", async () => {
		const { repository, tokenGenerator } = new InMemoryRepositoryTestContext()

		const account = await repository.create(person, timestamp)
		assert.equal("user-1", account.id.value)
		assert.equal(person.value, account.username.value)

		const anotherAccount = await repository.create(anotherPerson, timestamp)
		assert.equal("user-2", anotherAccount.id.value)
		assert.equal(anotherPerson.value, anotherAccount.username.value)

		assert.deepStrictEqual(repository, new InMemoryRepository(tokenGenerator, [account, anotherAccount]))
	})

	it("must get by username", async () => {
		const { repository } = new InMemoryRepositoryTestContext()
		await repository.create(person, timestamp)
		await repository.create(anotherPerson, timestamp)

		const account = await repository.getByUsername(anotherPerson)

		assert.equal("user-2", account.id.value)
		assert.equal(anotherPerson.value, account.username.value)
	})

	it("must get by ID", async () => {
		const { repository } = new InMemoryRepositoryTestContext()
		await repository.create(person, timestamp)
		await repository.create(anotherPerson, timestamp)

		const account = await repository.getById(new AccountId("user-2"))

		assert.equal(anotherPerson.value, account.username.value)
	})

	it("must update an account", async () => {
		const { repository, tokenGenerator } = new InMemoryRepositoryTestContext()
		const account = await repository.create(person, timestamp)

		const anotherAccount = await repository.create(anotherPerson, timestamp)
		const activeAccount = anotherAccount.activate()

		await repository.update(activeAccount)

		const updatedAccount = await repository.getById(new AccountId("user-2"))

		assert.equal(updatedAccount.isActive(), true)
		assert.deepStrictEqual(repository, new InMemoryRepository(tokenGenerator, [account, activeAccount]))
	})

	it("must fail to update a not existing account", async () => {
		const { repository } = new InMemoryRepositoryTestContext()

		const accountId = new AccountId("bad-id")
		const account = new Account(
			accountId,
			new AccountUsername("bad-username"),
			new SignUpToken("bad-token", timestamp + 30, accountId),
		)

		const failed = await repository
			.update(account)
			.then(() => false)
			.catch((err) => err instanceof AccountNotFoundError)

		assert.equal(failed, true)
	})

	it("must fail to signup when account already exists", async () => {
		const { repository } = new InMemoryRepositoryTestContext()
		await repository.create(person, timestamp)

		const failed: boolean = await repository
			.create(person, timestamp)
			.then(() => false)
			.catch((err) => err instanceof AccountAlreadyExists)

		assert.equal(failed, true)
	})
})
