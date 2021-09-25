import { Application, Router, RouterContext } from "https://deno.land/x/oak@v9.0.0/mod.ts"
import { existsSync } from 'https://deno.land/std@0.108.0/fs/mod.ts'
import { stringToUint, UintToString, getTemplateFilePath } from './utils.ts'
import { Template } from './types.ts'

const HOST = 'localhost'
const PORT = 8080
const app = new Application()
const router = new Router()

router.get('/', (ctx: RouterContext) => {
  ctx.response.body = 'Welcome to my templo server :)'
})

router.get('/templates', (ctx: RouterContext) => {
  try {
    const templates = Array.from(Deno.readDirSync('./templates'))
  
    if (templates.length == 0) {
      ctx.response.status = 200
      ctx.response.body = []
    }

    ctx.response.status = 200
    ctx.response.body = templates
      .map(filename => Deno.readFileSync(getTemplateFilePath(filename.name)))
      .map(UintToString)
      .map(str => JSON.parse(str))
  
  } catch (error) {
    ctx.response.status = 500
    ctx.response.body = {
      error: String(error)
    }
  }
})

router.get('/templates/:templateName', (ctx: RouterContext) => {
  try {
    const templateName = ctx.params.templateName

    if (!templateName) {
      throw 'Template name must be specified.'
    }

    const templateFilename = getTemplateFilePath(templateName)

    if (!existsSync(templateFilename)) {
      ctx.response.status = 404
      ctx.response.body = {
        error: `Not is possible to find "${templateName}".`
      }
      return
    }

    ctx.response.status = 200
    ctx.response.body = UintToString(Deno.readFileSync(templateFilename))

  } catch (error) {
    ctx.response.status = 500
    ctx.response.body = {
      error: String(error)
    }
  }
})

router.post('/pub', async (ctx: RouterContext) => {
  try {
    const template: Template = await ctx.request.body().value
    await Deno.writeTextFile(getTemplateFilePath(template.name), JSON.stringify(template))

    ctx.response.status = 201
    ctx.response.body = {
      success: `Template "${template.name}" was published.`
    }

  } catch (error) {
    ctx.response.status = 500
    ctx.response.body = {
      error: String(error)
    }
  }
})

router.delete('/unpub/:templateName', (ctx: RouterContext) => {
  try {
    const templateName: string | undefined = ctx.params.templateName

    if (!templateName) {
      throw 'Template name must be specified.'
    }

    if (!existsSync(getTemplateFilePath(templateName))) {
      ctx.response.status = 404
      ctx.response.body = {
        error: `Not is possible to find "${templateName}".`
      }
      return
    }

    Deno.removeSync(getTemplateFilePath(templateName))

    ctx.response.status = 200
    ctx.response.body = {
      success: `Template "${templateName}" was unpublished.`
    }

  } catch (error) {
    ctx.response.status = 500
    ctx.response.body = {
      error: String(error)
    }
  }
})

router.put('/update/:templateName', async (ctx: RouterContext) => {
  try {
    const templateName: string | undefined = ctx.params.templateName
    const template: Template = await ctx.request.body().value

    if (!templateName) {
      throw 'Template name must be specified.'
    }

    if (!existsSync(getTemplateFilePath(templateName))) {
      ctx.response.status = 404
      ctx.response.body = {
        error: `Not is possible to find "${templateName}".`
      }
      return
    }

    Deno.removeSync(getTemplateFilePath(templateName))
    Deno.writeFileSync(getTemplateFilePath(template.name), stringToUint(JSON.stringify(template)))

    ctx.response.status = 200
    ctx.response.body = {
      success: `Template "${templateName}" was updated.`
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