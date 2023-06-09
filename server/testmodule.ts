import { asyncLocalStore, moduleId } from "#root/server/asyncLocalStorage";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function testModule() {
  await sleep(2000);

  console.log('testModule - store: ', asyncLocalStore.getStore(), moduleId);

  const someVal = asyncLocalStore.getStore()?.get('SomeVal');

  return { moduleId, someVal };
}