import {Router, error} from "itty-router";
import {KV_ROUTE, KV_ROUTE_PUT, kvGetHandler, kvPutHandler, validateKvGetRequest, validateKvPutRequest} from "./kv";
import {GREET_ROUTE, greetHandler} from "./greet";
import {COUNTER_ROUTE, counterHandler} from "./counter";

const router = Router()

router
    .get(GREET_ROUTE, greetHandler)
    .get(KV_ROUTE, validateKvGetRequest, kvGetHandler)
    .put(KV_ROUTE_PUT, validateKvPutRequest, kvPutHandler)
    .get(COUNTER_ROUTE, counterHandler)
    .all("*", () => error(404, "not found"))

export const handleRequest = router.handle