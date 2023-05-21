import { Toucan } from "toucan-js";
import { Env, WorkerRequest } from "./interfaces";
import { ZodError } from "zod";

export function buildRequest(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
  sentry?: Toucan
): WorkerRequest {
  const temp: WorkerRequest = request as WorkerRequest;
  temp.req = request;
  temp.env = env;
  temp.ctx = ctx;
  temp.sentry = sentry;
  return temp;
}

export function formatZodError(e: ZodError): string {
  return e.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(", ");
}