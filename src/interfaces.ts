import { z } from "zod";
import { Toucan } from "toucan-js";
import { IRequestStrict } from "itty-router";
export interface Env {
  ENVIRONMENT: string;
  RELEASE?: string;
  SENTRY_DSN?: string;
  ANALYTICS?: AnalyticsEngineDataset;
  KV: KVNamespace;
  AUTH: KVNamespace;
  COUNTER: DurableObjectNamespace;
}

export type WorkerRequest = {
  req: Request;
  env: Env;
  ctx: ExecutionContext;
  sentry?: Toucan;
} & IRequestStrict;

export const KvGetRequestSchema = z.object({
  key: z.string().min(1).max(128),
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
