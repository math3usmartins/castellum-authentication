export class AccountId {
	constructor(public readonly value: string) {}

	public equal(id: AccountId): boolean {
		return this.value === id.value
	}
}
