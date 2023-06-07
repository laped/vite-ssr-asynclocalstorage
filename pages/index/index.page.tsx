import { asyncLocalStore } from '#root/server/asyncLocalStorage';
import { Counter } from './Counter'

export { Page }

function Page() {
  console.log('index.page - store: ', asyncLocalStore.getStore());

  return (
    <>
      <h1>Welcome</h1>
      This page is:
      <ul>
        <li>Rendered to HTML.</li>
        <li>
          Interactive. <Counter />
        </li>
      </ul>
    </>
  )
}
