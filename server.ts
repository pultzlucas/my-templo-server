import { Application, Router, RouterContext } from "https://deno.land/x/oak@v9.0.0/mod.ts"
import { existsSync } from 'https://deno.land/std@0.108.0/fs/mod.ts'

const HOST = 'localhost'
const PORT = 8080
const app = new Application()
const router = new Router()

interface Template {
  name: string
  created_at: string
  paths: Array<{
    path: string
    path_type: string
  }>
  contents: Array<{
    file_path: string
    text: string
  }>
  args?: Array<{
    key: string
    query: string
    default: string
  }> | null
}

router.get('/', (ctx: RouterContext) => {
  ctx.response.body = 'Welcome to my templo server :)'
})

router.get('/templates', (ctx: RouterContext) => {
  const templates = Array.from(Deno.readDirSync('./templates'))

  if (templates.length == 0) {
    ctx.response.status = 200
    ctx.response.body = []
  }

  ctx.response.status = 200
  ctx.response.body = templates.map(filename => Deno.readFileSync(filename.name))
})

router.get('/templates/:templateName', (ctx: RouterContext) => {
  const templateName = ctx.params.templateName
  const templateFilename = `./templates/${templateName}.tpo`

  if (!existsSync(templateFilename)) {
    ctx.response.status = 404
    ctx.response.body = {
      error: 'No template found.'
    }
  }

  const myTemplate = Deno.readFileSync(templateFilename)

  ctx.response.status = 200
  ctx.response.body = myTemplate
})

router.post('/pub', async (ctx: RouterContext) => {
  try {
    const template: Template = await ctx.request.body().value
    const templateFile = Deno.createSync(`./templates/${template.name}.tpo`)
    const templateString = String(template)
    templateFile.writeSync()

    ctx.response.status = 201
    ctx.response.body = {
      success: 'Template was published.'
    }

  } catch (error) {
    ctx.response.status = 500
    ctx.response.body = {
      error: String(error)
    }
  }
})

app.use(router.routes())
app.use(router.allowedMethods())

console.log(`Server is running on ${HOST}:${PORT}`);

await app.listen({ port: PORT })