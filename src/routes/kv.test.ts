import { Env, KvGetRequest, KvPutRequest } from "../interfaces";
import { describe, expect, it } from "vitest";
import {
  kvGetHandler,
  kvPutHandler,
  validateKvGetRequest,
  validateKvPutRequest,
} from "./kv";
import { buildRequest } from "../helpers";

describe("kvGetHandler", () => {
  it("should return valid response", async () => {
    const ctx = new ExecutionContext();
    const env = getMiniflareBindings() as Env;
    await env.KV.put("test", "test value");
    const req = buildRequest(
      new Request("https://example.com/kv/test"),
      env,
      ctx
    ) as KvGetRequest;
    req.parsedBody = {
      key: "test",
    };
    const res = await kvGetHandler(req);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ key: "test", value: "test value" });
  });

  it("should throw validation error", async () => {
    const ctx = new ExecutionContext();
    const env = getMiniflareBindings() as Env;
    await env.KV.put("test", "test value");
    const req = buildRequest(
      new Request("https://example.com/kv/test"),
      env,
      ctx
    ) as KvGetRequest;
    req.params = {};
    // missing key in KvGetRequest
    const res = await validateKvGetRequest(req);
    expect(res?.status).toBe(400);
    expect(await res?.json()).toEqual({ status: 400, error: "key: Required" });
  });
});

describe("kvPutHandler", () => {
  it("should set and return valid response", async () => {
    const ctx = new ExecutionContext();
    const env = getMiniflareBindings() as Env;
    const req = buildRequest(
      new Request("https://example.com/kv/test", {
        method: "PUT",
        body: JSON.stringify({ key: "test", value: "test value" }),
      }),
      env,
      ctx
    ) as KvPutRequest;
    req.parsedBody = {
      key: "test",
      value: "test value",
    };
    const res = await kvPutHandler(req);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ key: "test", value: "test value" });
    expect(await env.KV.get("test")).toEqual("test value");
  });

  it("should throw validation error", async () => {
    const ctx = new ExecutionContext();
    const env = getMiniflareBindings() as Env;
    await env.KV.put("test", "test value");
    const req = buildRequest(
      new Request("https://example.com/kv/test", {
        method: "PUT",
        body: JSON.stringify({}),
      }),
      env,
      ctx
    ) as KvPutRequest;

    const res = await validateKvPutRequest(req);
    expect(res?.status).toBe(400);
    expect(await res?.json()).toEqual({
      status: 400,
      error: "key: Required, value: Required",
    });
  });
});
