import { WorkerRequest } from "../interfaces";
import { IRequest, json } from "itty-router";

export const GREET_ROUTE = "/greet";

export async function greetHandler(
  request: WorkerRequest | IRequest
): Promise<Response> {
  const name = request.query?.name;
  return json({
    message: `Hello ${name ? name : "world"}!`,
  });
}
