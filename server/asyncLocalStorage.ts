import { AsyncLocalStorage } from "node:async_hooks";

export const asyncLocalStore = new AsyncLocalStorage<Map<string, any>>();