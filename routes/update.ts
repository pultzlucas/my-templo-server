import { Router, RouterContext, Status } from "https://deno.land/x/oak@v9.0.0/mod.ts"
import { stringToUint, getTemplateFilePath } from '../utils.ts'
import { existsSync } from 'https://deno.land/std@0.108.0/fs/mod.ts'
import { Template } from '../types.ts'
import checkUserPermissions from '../middlewares/check-permissions.ts'

const router = new Router()
 
router.put('/:templateName', checkUserPermissions, async (ctx: RouterContext) => {
    try {
        const templateName: string | undefined = ctx.params.templateName
        const template: Template = await ctx.request.body().value

        if (!templateName) {
            ctx.response.status = Status.NotAcceptable
            ctx.response.body = {
                error: 'Template name must be specified.'
            }
            return
        }

        if (!existsSync(getTemplateFilePath(templateName))) {
        }

        Deno.removeSync(getTemplateFilePath(templateName))
        Deno.writeFileSync(getTemplateFilePath(template.name), stringToUint(JSON.stringify(template)))

        ctx.response.status = Status.OK
        ctx.response.body = {
            success: `Template "${templateName}" was updated.`
        }

    } catch (error) {
        ctx.response.status = Status.InternalServerError
        ctx.response.body = {
            error: String(error)
        }
    }
})

export default router