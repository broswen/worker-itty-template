import { z } from "zod";
import { Toucan } from "toucan-js";
import { IRequest, IRequestStrict } from "itty-router";
export interface Env {
  ENVIRONMENT: string;
  RELEASE?: string;
  SENTRY_DSN?: string;
  ANALYTICS?: AnalyticsEngineDataset;
  KV: KVNamespace;
  COUNTER: DurableObjectNamespace;
}

export function buildRequest(request: Request, env: Env, ctx: ExecutionContext, sentry?: Toucan): WorkerRequest {
  let temp: WorkerRequest = request as WorkerRequest;
  temp.req = request;
  temp.env = env;
  temp.ctx = ctx;
  temp.sentry = sentry;
  return temp;
}

export type WorkerRequest = {
  req: Request;
  env: Env;
  ctx: ExecutionContext;
  sentry?: Toucan;
} & IRequestStrict;

export const KvGetRequestSchema = z.object({
  key: z.string().min(1).max(128)
});

export type KvGetRequest = WorkerRequest & {
  parsedBody: z.infer<typeof KvGetRequestSchema>;
};

export const KvPutRequestSchema = z.object({
  key: z.string().min(1).max(128),
  value: z.string().max(128),
});
export type KvPutRequest = WorkerRequest & {
  parsedBody: z.infer<typeof KvPutRequestSchema>;
};
