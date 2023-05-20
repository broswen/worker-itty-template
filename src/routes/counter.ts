import { WorkerRequest } from "../interfaces";
import { error, IRequest } from "itty-router";

export const COUNTER_ROUTE = "/counter/:id";

export async function counterHandler(
  request: WorkerRequest | IRequest
): Promise<Response> {
  const id = request.params["id"];

  if (!id) {
    return error(400, "must specify counter id");
  }
  const counterId = request.env.COUNTER.idFromName(id);
  const obj = request.env.COUNTER.get(counterId);

  return obj.fetch(request.req);
}
