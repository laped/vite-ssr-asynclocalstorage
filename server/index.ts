// Note that this file isn't processed by Vite, see https://github.com/brillout/vite-plugin-ssr/issues/562

import express from 'express'
import compression from 'compression'
import { renderPage } from 'vite-plugin-ssr/server'
import { root } from './root.js'
import { asyncLocalStore, moduleId } from '#root/server/asyncLocalStorage'
import { testModule } from '#root/server/testmodule';

const isProduction = process.env.NODE_ENV === 'production'

startServer()

async function startServer() {
  const app = express()

  app.use(compression())

  // Middleware to init the AsyncLocalStorage context and propagate to the entire request call chain
  app.use((_req, _res, next) => {
    asyncLocalStore.run(new Map(), () => {
      asyncLocalStore.getStore()?.set("traceId", "Test123");

      next();
    });
  });

  app.get('/testModule', async (req, res, next) => {
    console.log('nodejs testModule:before - store: ', asyncLocalStore.getStore(), moduleId);
    const { moduleId: mId, someVal } = await testModule();
    console.log('nodejs testModule:after - store: ', asyncLocalStore.getStore(), moduleId);

    return res.status(200).json({
      moduleId: mId,
      someVal
    });
  })

  if (isProduction) {
    const sirv = (await import('sirv')).default
    app.use(sirv(`${root}/dist/client`))
  } else {
    const vite = await import('vite')
    const viteDevMiddleware = (
      await vite.createServer({
        root,
        server: { middlewareMode: true }
      })
    ).middlewares
    app.use(viteDevMiddleware)
  }

  app.get('*', async (req, res, next) => {
    const pageContextInit = {
      urlOriginal: req.originalUrl
    }

    console.log('nodejs renderPage:before - store: ', asyncLocalStore.getStore(), moduleId);
    const pageContext = await renderPage(pageContextInit)
    console.log('nodejs renderPage:after - store: ', asyncLocalStore.getStore(), moduleId);

    const { httpResponse } = pageContext
    if (!httpResponse) return next()
    const { body, statusCode, contentType, earlyHints } = httpResponse
    if (res.writeEarlyHints) res.writeEarlyHints({ link: earlyHints.map((e) => e.earlyHintLink) })
    res.status(statusCode).type(contentType).send(body)
  })

  const port = process.env.PORT || 3000
  app.listen(port)
  console.log(`Server running at http://localhost:${port}`)
}
