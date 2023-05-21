import { WorkerRequest } from "../interfaces";
import { error, RouteHandler } from "itty-router";
import jwt from "@tsndr/cloudflare-worker-jwt";

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

export function jwtAuth(cookieName: string): RouteHandler<WorkerRequest & {cookies: {[key: string]: string}}> {
  return async (request: WorkerRequest & {cookies: {[key: string]: string}}): Promise<Response | undefined> => {
    console.log(request.cookies)
    const token = request.cookies[cookieName]
    if (!token) {
      return error(401, "unauthorized");
    }
    try {
      const valid = await jwt.verify(token, request.env.JWT_SECRET, {throwError: true})
    } catch (e) {
      return error(401, "unauthorized");
    }
    return undefined;
  }
}