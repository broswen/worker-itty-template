import { describe, expect, it } from "vitest";
import { Env } from "../interfaces";
import { buildRequest } from "../helpers";
import { kvAuth } from "./auth";

describe("kvAuth", () => {
  it("should return unauthorized", async () => {
    const ctx = new ExecutionContext();
    const env = getMiniflareBindings() as Env;
    const req = buildRequest(
      new Request("https://example.com/auth/ping"),
      env,
      ctx
    );
    const res = await kvAuth(req);
    expect(res?.status).toBe(401);
    expect(await res?.json()).toEqual({ status: 401, error: "unauthorized" });
  });
  it("should return undefined (authorized)", async () => {
    const ctx = new ExecutionContext();
    const env = getMiniflareBindings() as Env;
    await env.AUTH.put("token", "true");
    const req = buildRequest(
      new Request("https://example.com/auth/ping", {
        headers: {
          Authorization: "bearer token",
        },
      }),
      env,
      ctx
    );
    const res = await kvAuth(req);
    expect(res).toBeUndefined();
  });
});
