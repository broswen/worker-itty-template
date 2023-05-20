import { error, IRequest, json } from "itty-router";
import {
  KvGetRequest,
  KvGetRequestSchema,
  KvPutRequest,
  KvPutRequestSchema,
} from "../interfaces";

export const KV_ROUTE = "/kv/:key";
export const KV_ROUTE_PUT = "/kv";

export async function kvGetHandler(
  request: KvGetRequest | IRequest
): Promise<Response> {
  const value = await request.env.KV.get(request.params["key"]);
  console.log(value);
  if (value === undefined) {
    return error(404, "not found");
  }
  return json({
    key: request.params["key"],
    value: value,
  });
}

export async function kvPutHandler(
  request: KvPutRequest | IRequest
): Promise<Response> {
  if (!request.body) {
    return error(400, "body is empty");
  }
  await request.env.KV.put(request.body.key, request.body.value);
  return json({
    key: request.body.key,
    value: request.body.value,
  });
}

export async function validateKvGetRequest(
  request: KvGetRequest | IRequest
): Promise<Response | undefined> {
  try {
    KvGetRequestSchema.parse(request.params["key"]);
    return undefined;
  } catch (e) {
    console.log(e);
    return error(400, "bad request");
  }
}

export async function validateKvPutRequest(
  request: KvPutRequest | IRequest
): Promise<Response | undefined> {
  const body = await request.req.json().catch(() => ({}));
  try {
    request.body = KvPutRequestSchema.parse(body);
    return undefined;
  } catch (e) {
    console.log(e);
    return error(400, "bad request");
  }
}
