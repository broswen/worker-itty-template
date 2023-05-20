import { z } from "zod"
import {Toucan} from "toucan-js";
import {IRequest} from "itty-router";
export interface Env {
    ENVIRONMENT: string,
    RELEASE?: string,
    SENTRY_DSN?: string
    ANALYTICS?: AnalyticsEngineDataset
    KV: KVNamespace
    COUNTER: DurableObjectNamespace
}

export type WorkerRequest = IRequest & {
    req: Request
    env: Env
    ctx: ExecutionContext
    sentry?: Toucan
}

export const KvGetRequestSchema = z.string().min(1).max(128)
export type KvGetRequest = WorkerRequest & {
    key?: string
}

export const KvPutRequestSchema = z.object({
    key: z.string().min(1).max(128),
    value: z.string().max(128)
})
export type KvPutRequest = WorkerRequest & {
    key?: string
    body?: z.infer<typeof KvPutRequestSchema>
}