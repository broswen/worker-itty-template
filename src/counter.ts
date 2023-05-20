import {Env} from "./interfaces";
import {error, json } from "itty-router";
import {Toucan} from "toucan-js";

export class Counter implements DurableObject {
    state: DurableObjectState
    env: Env
    constructor(state: DurableObjectState, env: Env) {
        this.state = state
        this.env = env
    }

    async fetch(request: Request): Promise<Response> {
        const sentry = new Toucan({
            request,
            dsn: this.env.SENTRY_DSN,
            release: this.env.RELEASE
        })
        try {
            const count = await this.state.storage?.get<number>("count") ?? 0
            await this.state.storage?.put<number>("count", count + 1)
            return json({count})
        } catch (e) {
            sentry.captureException(e)
            return error(500, "internal server error")
        }
    }
}

