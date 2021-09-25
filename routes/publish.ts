import { Router, RouterContext } from "https://deno.land/x/oak@v9.0.0/mod.ts"
import { getTemplateFilePath } from '../utils.ts'
import { Template } from '../types.ts'

const router = new Router()

router.post('/', async (ctx: RouterContext) => {
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

export default router