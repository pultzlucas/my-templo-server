import { Application, Router, RouterContext } from "https://deno.land/x/oak@v9.0.0/mod.ts"
import { existsSync } from 'https://deno.land/std@0.108.0/fs/mod.ts'
import { stringToUint, UintToString, getTemplateFilePath } from './utils.ts'
import update from './methods/update.ts'
import unpublish from './methods/unpublish.ts'
import publish from './methods/publish.ts'
import templates from './methods/templates.ts'

const HOST = 'localhost'
const PORT = 8080
const app = new Application()
const router = new Router()

router.get('/', (ctx: RouterContext) => {
  ctx.response.body = 'Welcome to my templo server :)'
})

app.use(update.prefix('/update').routes())
app.use(unpublish.prefix('/unpub').routes())
app.use(publish.prefix('/pub').routes())
app.use(templates.prefix('/templates').routes())

app.use(router.routes())
app.use(router.allowedMethods())

console.log(`Server is running on ${HOST}:${PORT}`);

await app.listen({ port: PORT })