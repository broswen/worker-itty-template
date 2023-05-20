import {Env, WorkerRequest} from "../interfaces";
import {greetHandler} from "./greet";
import { describe, expect, it} from "vitest";

describe("greetHandler", () => {
    it("should return valid response", async () => {
        const ctx = new ExecutionContext()
        const env = getMiniflareBindings() as Env
        const req: WorkerRequest = {
            params: {}, query: {},
            req: new Request("https://example.com/greet"),
            method: "GET",
            url: "https://example.com/greet",
            ctx,
            env
        }
        const res = await greetHandler(req)
        expect(res.status).toBe(200)
        expect(await res.json()).toEqual({message: "Hello world!"})
    })
    it("should return valid response with query param", async () => {
        const ctx = new ExecutionContext()
        const env = getMiniflareBindings() as Env
        const req: WorkerRequest = {
            params: {},
            req: new Request("https://example.com/greet?name=brad"),
            method: "GET",
            url: "https://example.com/greet?name=brad",
            ctx,
            env,
            query: {
                name: "brad"
            }
        }
        const res = await greetHandler(req)
        expect(res.status).toBe(200)
        expect(await res.json()).toEqual({message: "Hello brad!"})
    })
});