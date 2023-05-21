import { WorkerRequest } from "../interfaces";
import { error } from "itty-router";

// kvAuth is a middleware that looks up the bearer token in a KV Namespace
// and returns unauthorized if it doesn't exist
export async function kvAuth(
  request: WorkerRequest
): Promise<Response | undefined> {
  const parts = request.headers.get("Authorization")?.split(" ") ?? [];
  if (parts.length != 2) {
    return error(401, "unauthorized");
  }
  const token = parts[1];
  const value = await request.env.AUTH.get(token);
  if (value === null) {
    return error(401, "unauthorized");
  }
  return undefined;
}
