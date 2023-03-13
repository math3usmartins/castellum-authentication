export class AccountUsername {
	constructor(public readonly value: string) {}

	public equal(username: AccountUsername): boolean {
		return this.value === username.value
	}
}
