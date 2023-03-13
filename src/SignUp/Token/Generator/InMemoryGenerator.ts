import type { SignUpTokenGenerator } from "../SignUpTokenGenerator"
import { SignUpToken } from "../../SignUpToken"
import type { AccountId } from "../../../Account/AccountId"

export class InMemoryGenerator implements SignUpTokenGenerator {
	public constructor(private readonly lifetime: number, private readonly tokens: SignUpToken[]) {}

	public async generate(account: AccountId, timestamp: number): Promise<SignUpToken> {
		const id = this.tokens.length + 1

		const token = new SignUpToken(`token-${id}`, timestamp + this.lifetime, account)

		return await Promise.resolve(token)
	}
}
