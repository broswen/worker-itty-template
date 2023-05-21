import { error, json, Router, text, withContent, withCookies } from "itty-router";
import { KV_ROUTE, KV_ROUTE_PUT, kvGetHandler, kvPutHandler, validateKvGetRequest, validateKvPutRequest } from "./kv";
import { GREET_ROUTE, greetHandler } from "./greet";
import { jwtAuth, kvAuth } from "./auth";
import { WorkerRequest } from "../interfaces";
import jwt from "@tsndr/cloudflare-worker-jwt";

const router = Router();

router
  .get("/ping", () => text("pong"))
  .get("/auth/ping", kvAuth, () => text("authenticated pong"))
  // handler that verifies the token in the "jwt" cookie is valid
  .get("/jwt/ping", withCookies, jwtAuth("jwt"), () => text("authenticated pong"))
  .get("/jwt/issue", async (request: WorkerRequest) => {
    // dummy route that just issues a jwt with the provided secret
    const token = await jwt.sign({
      name: 'john doe',
      exp: Math.floor(Date.now() / 1000) + (30 * 60 * 60) //30m expiration
    }, request.env.JWT_SECRET)
    const response = json({ token });
    response.headers.append("Set-Cookie", `jwt=${token}`)
    return response;
  })
  .get(GREET_ROUTE, greetHandler)
  .get(KV_ROUTE, validateKvGetRequest, kvGetHandler)
  .put(KV_ROUTE_PUT, validateKvPutRequest, kvPutHandler)
  // ignore DO as it's breaking vitest atm
  // .get(COUNTER_ROUTE, counterHandler)
  .all("*", () => error(404, "not found"));

export const handleRequest = router.handle;
