import { Env } from "../interfaces";
import { greetHandler } from "./greet";
import { describe, expect, it } from "vitest";
import { buildRequest } from "../helpers";

describe("greetHandler", () => {
  it("should return valid response", async () => {
    const ctx = new ExecutionContext();
    const env = getMiniflareBindings() as Env;
    const req = buildRequest(
      new Request("https://example.com/greet"),
      env,
      ctx
    );
    const res = await greetHandler(req);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ message: "Hello world!" });
  });
  it("should return valid response with query param", async () => {
    const ctx = new ExecutionContext();
    const env = getMiniflareBindings() as Env;
    const req = buildRequest(
      new Request("https://example.com/greet?name=brad"),
      env,
      ctx
    );
    req.query = {
      name: "brad",
    };
    const res = await greetHandler(req);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ message: "Hello brad!" });
  });

  it("should return first query param", async () => {
    const ctx = new ExecutionContext();
    const env = getMiniflareBindings() as Env;
    const req = buildRequest(
      new Request("https://example.com/greet?name=brad&lastname"),
      env,
      ctx
    );
    req.query = {
      name: ["brad", "lastname"],
    };
    const res = await greetHandler(req);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ message: "Hello brad!" });
  });
});
