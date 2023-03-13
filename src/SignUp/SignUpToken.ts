import type { AccountId } from "../Account/AccountId"

export class SignUpToken {
	public constructor(
		public readonly value: string,
		public readonly expiresAt: number,
		public readonly account: AccountId,
	) {}
}
