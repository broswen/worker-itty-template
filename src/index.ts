import { handleRequest } from "./routes";
import { Env, buildRequest } from "./interfaces";
import { Toucan } from "toucan-js";
import { error } from "itty-router";
// export { Counter } from "./counter";

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const sentry = new Toucan({
      request,
      context: ctx,
      dsn: env.SENTRY_DSN,
      release: env.RELEASE,
    });
    const incomingRequest = buildRequest(request, env, ctx, sentry);

    return await handleRequest(incomingRequest)
      // .then(respondWithJSON)
      .catch((e) => {
        console.log(e);
        sentry?.captureException(e);
        return error(500, "internal server error");
      });
  },
};
