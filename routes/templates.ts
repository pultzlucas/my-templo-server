import { Router, RouterContext } from "https://deno.land/x/oak@v9.0.0/mod.ts"
import { getTemplateFilePath, UintToString } from '../utils.ts'
import { existsSync } from 'https://deno.land/std@0.108.0/fs/mod.ts'

const router = new Router()

router.get('/', (ctx: RouterContext) => {
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

router.get('/:templateName', (ctx: RouterContext) => {
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

export default router