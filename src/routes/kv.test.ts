import { Env, KvGetRequest, KvPutRequest } from "../interfaces";
import { describe, expect, it } from "vitest";
import {
  kvGetHandler,
  kvPutHandler,
  validateKvGetRequest,
  validateKvPutRequest,
} from "./kv";

describe("kvGetHandler", () => {
  it("should return valid response", async () => {
    const ctx = new ExecutionContext();
    const env = getMiniflareBindings() as Env;
    await env.KV.put("test", "test value");
    const req: KvGetRequest = {
      params: {
        key: "test",
      },
      query: {},
      req: new Request("https://example.com/kv"),
      method: "GET",
      url: "https://example.com/kv",
      ctx,
      env,
    };
    const res = await kvGetHandler(req);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ key: "test", value: "test value" });
  });
  it("should throw validation error", async () => {
    const ctx = new ExecutionContext();
    const env = getMiniflareBindings() as Env;
    await env.KV.put("test", "test value");
    const req: KvGetRequest = {
      params: {},
      query: {},
      req: new Request("https://example.com/kv"),
      method: "GET",
      url: "https://example.com/kv",
      ctx,
      env,
    };
    const res = await validateKvGetRequest(req);
    expect(res?.status).toBe(400);
    expect(await res?.json()).toEqual({ status: 400, error: "bad request" });
  });
});

describe("kvPutHandler", () => {
  it("should set and return valid response", async () => {
    const ctx = new ExecutionContext();
    const env = getMiniflareBindings() as Env;
    const req: KvPutRequest = {
      req: new Request("https://example.com/kv", {
        method: "PUT",
        body: JSON.stringify({ key: "test", value: "test value" }),
      }),
      method: "PUT",
      url: "https://example.com/kv",
      ctx,
      env,
      body: {
        key: "test",
        value: "test value",
      },
      params: {
        key: "test",
      },
      query: {},
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
    const req: KvPutRequest = {
      req: new Request("https://example.com/kv", {
        method: "PUT",
        body: JSON.stringify({}),
      }),
      method: "PUT",
      url: "https://example.com/kv",
      ctx,
      env,
      params: {
        key: "test",
      },
      query: {},
    };
    const res = await validateKvPutRequest(req);
    expect(res?.status).toBe(400);
    expect(await res?.json()).toEqual({ status: 400, error: "bad request" });
  });
});
