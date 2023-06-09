import { error, json } from "itty-router";
import {
  KvGetRequest,
  KvGetRequestSchema,
  KvPutRequest,
  KvPutRequestSchema,
} from "../interfaces";
import { formatZodError } from "../helpers";

export const KV_ROUTE = "/kv/:key";
export const KV_ROUTE_PUT = "/kv";

export async function validateKvGetRequest(
  request: KvGetRequest
): Promise<Response | undefined> {
  try {
    const result = KvGetRequestSchema.safeParse({ key: request.params["key"] });
    if (!result.success) {
      return error(400, formatZodError(result.error));
    }
    request.parsedBody = result.data;
    return undefined;
  } catch (e) {
    console.log(e);
    return error(400, "bad request");
  }
}

export async function kvGetHandler(request: KvGetRequest): Promise<Response> {
  request.env.ANALYTICS?.writeDataPoint({
    indexes: [request.parsedBody.key],
    blobs: [request.method],
  });
  const value = await request.env.KV.get(request.parsedBody.key);
  if (value === null) {
    return error(404, "not found");
  }
  return json({
    key: request.parsedBody.key,
    value: value,
  });
}

export async function validateKvPutRequest(
  request: KvPutRequest
): Promise<Response | undefined> {
  const body = await request.json().catch(() => ({}));
  try {
    const result = KvPutRequestSchema.safeParse(body);
    if (!result.success) {
      return error(400, formatZodError(result.error));
    }
    request.parsedBody = result.data;
    return undefined;
  } catch (e) {
    return error(400, "bad request");
  }
}

export async function kvPutHandler(request: KvPutRequest): Promise<Response> {
  request.env.ANALYTICS?.writeDataPoint({
    indexes: [request.parsedBody.key],
    blobs: [request.method],
  });
  await request.env.KV.put(request.parsedBody.key, request.parsedBody.value);
  return json({
    key: request.parsedBody.key,
    value: request.parsedBody.value,
  });
}
