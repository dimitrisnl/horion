import type {Context} from "hono";

import {createEmitter} from "@hono/event-emitter";

import {type AvailableEvents, handlers} from "./handlers";

// Wrap the hono context, because I don't have access to it through orpc
export const createContextEventEmitter = (context: Context) => {
  const eventEmitter = createEmitter(handlers);

  const emit = (
    event: keyof AvailableEvents,
    payload: AvailableEvents[keyof AvailableEvents],
  ) => {
    eventEmitter.emitAsync(context, event, payload);
  };

  return emit;
};
