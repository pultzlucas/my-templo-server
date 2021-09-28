import { Router, RouterContext, Status } from "https://deno.land/x/oak@v9.0.0/mod.ts"
import { getTemplateFilePath } from '../utils.ts'
import { Template } from '../types.ts'
import checkUserPermissions from '../middlewares/check-permissions.ts'

const router = new Router()

router.post('/', checkUserPermissions, async (ctx: RouterContext) => {
    try {
        const template: Template = await ctx.request.body().value
        const templateAlreadyExists = Array.from(Deno.readDirSync('./templates'))
            .some(templateFilename => templateFilename.name === `${template.name}.tpo`)

        console.log(templateAlreadyExists)

        if (templateAlreadyExists) {
            ctx.response.status = Status.Conflict
            ctx.response.body = {
                success: `Template "${template.name}" already exists.`
            }
            return
        }

        await Deno.writeTextFile(getTemplateFilePath(template.name), JSON.stringify(template))

        ctx.response.status = Status.Created
        ctx.response.body = {
            success: `Template "${template.name}" was published.`
        }

    } catch (error) {
        ctx.response.status = Status.InternalServerError
        ctx.response.body = {
            error: String(error)
        }
    }
})

export default router