import { Router, RouterContext, Status } from "https://deno.land/x/oak@v9.0.0/mod.ts"
import { getTemplateFilePath } from '../utils.ts'
import { existsSync } from 'https://deno.land/std@0.108.0/fs/mod.ts'
import checkUserPermissions from '../middlewares/check-permissions.ts'

const router = new Router()

router.delete('/:templateName', checkUserPermissions, (ctx: RouterContext) => {
    try {
        const templateName: string | undefined = ctx.params.templateName

        if (!templateName) {
            ctx.response.status = Status.NotAcceptable
            ctx.response.body = {
                error: 'Template name must be specified.',
            }
            return
        }

        if (!existsSync(getTemplateFilePath(templateName))) {
            ctx.response.status = Status.NotFound
            ctx.response.body = {
                error: `Not is possible to find "${templateName}".`
            }
            return
        }

        Deno.removeSync(getTemplateFilePath(templateName))

        ctx.response.status = Status.OK
        ctx.response.body = {
            success: `Template "${templateName}" was unpublished.`
        }

    } catch (error) {
        ctx.response.status = Status.InternalServerError
        ctx.response.body = {
            error: String(error)
        }
    }
})

export default router