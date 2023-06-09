import { AsyncLocalStorage } from "node:async_hooks";

export const asyncLocalStore = new AsyncLocalStorage<Map<string, any>>();
export const moduleId = Math.random().toFixed(20).slice(2);