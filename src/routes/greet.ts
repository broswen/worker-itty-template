import { Env, WorkerRequest } from "../interfaces";
import { json } from "itty-router";
import { Toucan } from "toucan-js";

export const GREET_ROUTE = "/greet";

export async function greetHandler(
  request: WorkerRequest,
): Promise<Response> {
  let name = request.query?.name;
  // use first value if multiple are specified
  if (Array.isArray(name)) {
    name = name[0];
  }
  return json({
    message: `Hello ${name ? name : "world"}!`,
  });
}
